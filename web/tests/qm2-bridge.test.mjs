import {test} from 'node:test'
import assert from 'node:assert/strict'
import { isNbgQm2Receipt,convertNbgQm2Receipt } from '../src/qm2Bridge.js'
import { validatePayload } from '../src/graph.js'

const methods=['SEQUENTIAL','SEEDED_SHUFFLE','NBG_GEAR']
const stats=values=>{
  const sorted=[...values].sort((a,b)=>a-b),n=values.length
  const mean=values.reduce((a,b)=>a+b,0)/n
  const stddev=Math.sqrt(values.reduce((s,x)=>s+(x-mean)**2,0)/n)
  const pct=p=>{const i=(n-1)*p,l=Math.floor(i),r=Math.ceil(i);return sorted[l]+(sorted[r]-sorted[l])*(i-l)}
  const median=n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2
  return {n,median,mean,stddev,coefficientOfVariation:mean===0?null:stddev/Math.abs(mean),
    min:sorted[0],max:sorted.at(-1),q1:pct(.25),q3:pct(.75)}
}
function makeSelfConsistentFixture(){
  // Deliberately constructed synthetic example, NOT a real SHA-256d trace.
  // Tests only the adapter's shape/arithmetic rules, not cryptographic validity.
  const orders=[
    [...methods],
    ['SEEDED_SHUFFLE','NBG_GEAR','SEQUENTIAL'],
    ['NBG_GEAR','SEQUENTIAL','SEEDED_SHUFFLE'],
  ]
  const seed=369,universe=32,rounds=3,bits=4
  const trialSchedule=orders.map((order,i)=>({round:i+1,seed:seed+17+i*131,order}))
  const measuredRounds=trialSchedule.map((plan,i)=>({
    round:plan.round,seed:plan.seed,executionOrder:[...plan.order],
    trials:plan.order.map((strategy,pos)=>{
      const elapsedMs=11+i*2+pos
      return {strategy,executionPosition:pos+1,elapsedMs,
        hashesPerSecond:Number((universe/(elapsedMs/1000)).toFixed(3)),
        hashesComputed:universe,coverage:1,collisions:0,hits:2,
        firstHitAttempt:4,verifiedHitCount:2,independentRehashPass:true}
    }),
  }))
  const referenceAudits=trialSchedule.map(plan=>({
    round:plan.round,seed:plan.seed,verified:true,referenceRecomputations:universe,
    referenceHitNonces:[3,17],allStrategyHitSetsMatch:true,
    reports:methods.map(strategy=>({strategy,fullyReverified:true,
      verifiedAcceptedNonces:2,rehashedCandidates:universe,validFirstHit:true,
      completeCoverage:true})),
  }))
  const summaries=methods.map(strategy=>{
    const trials=measuredRounds.map(row=>row.trials.find(t=>t.strategy===strategy))
    return {strategy,throughput:stats(trials.map(t=>t.hashesPerSecond)),
      elapsedMs:stats(trials.map(t=>t.elapsedMs)),firstHitAttempts:trials.map(t=>t.firstHitAttempt),
      totalHashes:universe*rounds,allReverified:true,coverageEveryRound:true}
  })
  const perRound=measuredRounds.map(row=>{
    const rate=method=>row.trials.find(t=>t.strategy===method).hashesPerSecond
    return {round:row.round,gearVsSequential:rate('NBG_GEAR')/rate('SEQUENTIAL'),
      shuffleVsSequential:rate('SEEDED_SHUFFLE')/rate('SEQUENTIAL')}
  })
  return {
    schema:'nbg.qm2.repeated-trial.v1',
    exportSchema:'nbg.qm2.receipt.v1',
    origin:'SOFTWARE_MEASURED_WITH_SYNTHETIC_INPUTS',
    authority:'DEMONSTRATION_ONLY',promoted:false,
    frozenNBGExperimentsModified:false,
    aqlenHandoff:'REQUIRES_SEPARATE_REVIEW_NO_SILENT_LEDGER_IMPORT',
    method:'SEEDED_BLOCK_RANDOMIZED_BALANCED_CROSSOVER',
    settings:{universe,rounds,bits,seed,warmup:0,
      fullDomainEveryRound:true,unmeasuredWarmups:true},
    trialSchedule,measuredRounds,referenceAudits,summaries,
    pairedComparisons:{
      gearVsSequential:stats(perRound.map(r=>r.gearVsSequential)),
      shuffleVsSequential:stats(perRound.map(r=>r.shuffleVsSequential)),
      perRound,metric:'LOCAL_SOFTWARE_THROUGHPUT_RATIO_NOT_PROVEN_ALGORITHM_ADVANTAGE',
    },
    checks:{
      equalHashesPerStrategy:true,everyHitRehashed:true,
      fullDomainNoDuplicateNonces:true,sameValidHashCountsEachRound:true,
      balancedExecutionPositions:true,identicalSeedsWithinRound:true,
    },
    physicalEnergyJoulesPerHash:null,
  }
}
test('self-consistent synthetic fixture converts to read-only AQLEN viewer payload',()=>{
  const original=makeSelfConsistentFixture()
  assert.equal(isNbgQm2Receipt(original),true)
  const before=structuredClone(original)
  const payload=convertNbgQm2Receipt(original)
  assert.deepEqual(original,before,'import must not mutate the receipt')
  assert.deepEqual(validatePayload(payload),[])
  assert.equal(payload.imported_from,'NBG_QM2_READ_ONLY')
  assert.equal(payload.nodes.length,6)
  assert.equal(payload.edges.length,5)
  assert.equal(payload.nodes.filter(x=>x.group==='evidence').length,5)
  assert.ok(payload.global_claim_boundary.includes('NOT independently recomputed'))
  assert.ok(payload.nodes.every(n=>n.warnings.length>=2))
})
test('forged metadata, altered arithmetic and invalid order are refused',()=>{
  const mutations=[
    x=>x.authority='VERIFIED',
    x=>x.physicalEnergyJoulesPerHash=2,
    x=>x.promoted=true,
    x=>x.checks.everyHitRehashed=false,
    x=>x.measuredRounds[0].trials[0].hashesComputed=31,
    x=>x.measuredRounds[0].trials[0].independentRehashPass=false,
    x=>x.measuredRounds[0].trials[0].elapsedMs=0,
    x=>x.measuredRounds[0].executionOrder.reverse(),
    x=>x.referenceAudits[0].referenceHitNonces.push(9000),
    x=>x.referenceAudits[0].reports[0].fullyReverified=false,
    x=>x.summaries[0].throughput.median+=2000,
    x=>x.pairedComparisons.perRound[0].gearVsSequential+=10,
    x=>x.settings.rounds=6,
    x=>x.exportSchema='nbg.qm2.receipt.v2',
  ]
  for(const mutate of mutations){
    const altered=makeSelfConsistentFixture()
    mutate(altered)
    assert.throws(()=>convertNbgQm2Receipt(altered),/QM2 import rejected:/)
  }
})
test('QM1 and generic dashboard formats do not trigger the QM2 adapter',()=>{
  assert.equal(isNbgQm2Receipt({nodes:[]}),false)
  assert.equal(isNbgQm2Receipt({graph_id:'nbg-qm1-bridge-369'}),false)
  assert.throws(()=>convertNbgQm2Receipt({schema:'unrelated'}),/not an NBG-QM2 receipt/)
  assert.equal(isNbgQm2Receipt({exportSchema:'nbg.qm2.receipt.v2'}),true)
})
