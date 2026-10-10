// NBG-QM2 v1 -> AQLEN in-memory dashboard adapter.
// Strict shape and arithmetic consistency are NOT independent proof of a benchmark.
const METHODS=Object.freeze(['SEQUENTIAL','SEEDED_SHUFFLE','NBG_GEAR'])
const DOMAIN=[32,64,128,256,512],REPETITIONS=[3,6,9],BITS=[4,6,8,10,12]
const BOUNDARY='IMPORTED NBG-QM2 SELF-REPORTED SOFTWARE BENCHMARK. Internal shape/arithmetic checks only; SHA-256 digests NOT independently recomputed here. No hardware, calibrated energy, quantum speedup, statistical significance, or ledger promotion.'
const isObj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x)
function need(ok,message){if(!ok)throw new Error('QM2 import rejected: '+message)}
const finite=x=>typeof x==='number'&&Number.isFinite(x)
const intRange=(x,lo,hi)=>Number.isInteger(x)&&x>=lo&&x<=hi
const close=(a,b)=>finite(a)&&finite(b)&&Math.abs(a-b)<=Math.max(1e-8,Math.abs(b)*1e-8)
const median=xs=>{const s=[...xs].sort((a,b)=>a-b),i=Math.floor(s.length/2);return s.length%2?s[i]:(s[i-1]+s[i])/2}
const textStatus=x=>String(x).replaceAll('_',' ')
export function isNbgQm2Receipt(input){
  return isObj(input)&&
    (input.schema==='nbg.qm2.repeated-trial.v1'||
     typeof input.exportSchema==='string'&&input.exportSchema.startsWith('nbg.qm2.'))
}
function validateStats(stats,observations,label){
  need(isObj(stats)&&stats.n===observations.length,'missing '+label+' distribution')
  need(observations.every(finite),'nonfinite '+label+' sample')
  const sorted=[...observations].sort((a,b)=>a-b)
  const mean=observations.reduce((s,x)=>s+x,0)/observations.length
  const sigma=Math.sqrt(observations.reduce((s,x)=>s+(x-mean)**2,0)/observations.length)
  const percentile=p=>{const n=(sorted.length-1)*p,l=Math.floor(n),r=Math.ceil(n);return sorted[l]+(sorted[r]-sorted[l])*(n-l)}
  for(const [key,val] of Object.entries({min:sorted[0],max:sorted.at(-1),
    mean,stddev:sigma,median:median(observations),q1:percentile(.25),q3:percentile(.75)}))
    need(close(stats[key],val),'inconsistent '+label+'.'+key)
  const cv=mean===0?null:sigma/Math.abs(mean)
  need(cv===null?stats.coefficientOfVariation===null:
    close(stats.coefficientOfVariation,cv),'inconsistent '+label+' variation')
}
function validateReceipt(input){
  need(input.schema==='nbg.qm2.repeated-trial.v1'&&
    input.exportSchema==='nbg.qm2.receipt.v1','unsupported QM2 receipt schema')
  need(input.origin==='SOFTWARE_MEASURED_WITH_SYNTHETIC_INPUTS'&&
    input.authority==='DEMONSTRATION_ONLY'&&input.promoted===false&&
    input.frozenNBGExperimentsModified===false&&
    input.aqlenHandoff==='REQUIRES_SEPARATE_REVIEW_NO_SILENT_LEDGER_IMPORT',
    'missing strict no-promotion provenance')
  need(input.method==='SEEDED_BLOCK_RANDOMIZED_BALANCED_CROSSOVER',
    'unrecognized experiment procedure')
  need(input.physicalEnergyJoulesPerHash===null,'invented energy measurement')
  const s=input.settings
  need(isObj(s)&&DOMAIN.includes(s.universe)&&REPETITIONS.includes(s.rounds)&&
    BITS.includes(s.bits)&&intRange(s.seed,0,65535)&&[0,16].includes(s.warmup)&&
    s.fullDomainEveryRound===true&&s.unmeasuredWarmups===true,'invalid frozen settings')
  need(Array.isArray(input.trialSchedule)&&input.trialSchedule.length===s.rounds&&
    Array.isArray(input.measuredRounds)&&input.measuredRounds.length===s.rounds&&
    Array.isArray(input.referenceAudits)&&input.referenceAudits.length===s.rounds,
    'trial schedule / observations / audits count mismatch')
  need(isObj(input.checks)&&[
    'equalHashesPerStrategy','everyHitRehashed','fullDomainNoDuplicateNonces',
    'sameValidHashCountsEachRound','balancedExecutionPositions','identicalSeedsWithinRound'
  ].every(k=>input.checks[k]===true),'reported internal control failure')
  const positions=Object.fromEntries(METHODS.map(k=>[k,[0,0,0]]))
  const samples=Object.fromEntries(METHODS.map(k=>[k,{rate:[],elapsed:[],first:[]}]))
  const paired=[]
  for(let i=0;i<s.rounds;i++){
    const plan=input.trialSchedule[i],round=input.measuredRounds[i],audit=input.referenceAudits[i]
    need(isObj(plan)&&isObj(round)&&isObj(audit)&&
      plan.round===i+1&&round.round===i+1&&audit.round===i+1&&
      intRange(plan.seed,0,65535)&&round.seed===plan.seed&&audit.seed===plan.seed,
      'round or paired header seed mismatch')
    need(Array.isArray(plan.order)&&plan.order.length===3&&
      METHODS.every(k=>plan.order.includes(k))&&Array.isArray(round.executionOrder)&&
      round.executionOrder.length===3&&plan.order.every((k,j)=>round.executionOrder[j]===k),
      'trial execution order differs from frozen plan')
    need(Array.isArray(round.trials)&&round.trials.length===3,'wrong number of strategy trials')
    need(audit.verified===true&&audit.allStrategyHitSetsMatch===true&&
      audit.referenceRecomputations===s.universe&&
      Array.isArray(audit.referenceHitNonces)&&Array.isArray(audit.reports)&&
      audit.reports.length===3,'invalid claimed digest audit')
    const expectedHits=audit.referenceHitNonces
    need(expectedHits.every((nonce,j)=>intRange(nonce,0,s.universe-1)&&
      (j===0||nonce>expectedHits[j-1])),'reference-hit indices invalid')
    for(const [pos,strategy] of plan.order.entries()){
      const trial=round.trials[pos]
      need(isObj(trial)&&trial.strategy===strategy&&trial.executionPosition===pos+1&&
        trial.hashesComputed===s.universe&&trial.coverage===1&&trial.collisions===0&&
        trial.hits===expectedHits.length&&trial.verifiedHitCount===expectedHits.length&&
        trial.independentRehashPass===true,'invalid per-strategy work or audit count')
      need(finite(trial.elapsedMs)&&trial.elapsedMs>=0&&
        (trial.hashesPerSecond===null&&trial.elapsedMs===0||
        finite(trial.hashesPerSecond)&&trial.hashesPerSecond>=0&&
          trial.elapsedMs>0&&Math.abs(trial.hashesPerSecond-
            Math.round(s.universe/(trial.elapsedMs/1000)*1000)/1000)<=.002),
        'inconsistent wall-clock throughput')
      need(expectedHits.length===0?trial.firstHitAttempt===null:
        intRange(trial.firstHitAttempt,1,s.universe),'invalid first-hit observation')
      const report=audit.reports.find(r=>r?.strategy===strategy)
      need(isObj(report)&&report.fullyReverified===true&&
        report.verifiedAcceptedNonces===expectedHits.length&&
        report.rehashedCandidates===s.universe&&report.validFirstHit===true&&
        report.completeCoverage===true,'reference audit contradicts trial')
      positions[strategy][pos]++
      samples[strategy].rate.push(trial.hashesPerSecond??0)
      samples[strategy].elapsed.push(trial.elapsedMs)
      samples[strategy].first.push(trial.firstHitAttempt)
    }
    const rate=k=>round.trials.find(t=>t.strategy===k).hashesPerSecond
    const baseline=rate('SEQUENTIAL')
    paired.push({round:i+1,gearVsSequential:baseline>0&&rate('NBG_GEAR')!==null?
      rate('NBG_GEAR')/baseline:null,shuffleVsSequential:baseline>0&&rate('SEEDED_SHUFFLE')!==null?
      rate('SEEDED_SHUFFLE')/baseline:null})
  }
  for(const method of METHODS)need(positions[method].every(n=>n===s.rounds/3),
    'scheduler execution order is not balanced')
  need(Array.isArray(input.summaries)&&input.summaries.length===3,'missing strategy summaries')
  for(const method of METHODS){
    const m=input.summaries.find(row=>row?.strategy===method)
    need(isObj(m)&&m.totalHashes===s.rounds*s.universe&&
      m.allReverified===true&&m.coverageEveryRound===true&&
      Array.isArray(m.firstHitAttempts)&&m.firstHitAttempts.length===s.rounds&&
      m.firstHitAttempts.every((v,i)=>v===samples[method].first[i]),
      'incorrect '+method+' summary')
    validateStats(m.throughput,samples[method].rate,method+' throughput')
    validateStats(m.elapsedMs,samples[method].elapsed,method+' elapsed')
  }
  const p=input.pairedComparisons
  need(isObj(p)&&p.metric==='LOCAL_SOFTWARE_THROUGHPUT_RATIO_NOT_PROVEN_ALGORITHM_ADVANTAGE'&&
    Array.isArray(p.perRound)&&p.perRound.length===s.rounds,'invalid paired comparisons')
  const valid=paired.filter(r=>r.gearVsSequential!==null)
  for(let i=0;i<s.rounds;i++){
    const from=p.perRound[i],calc=paired[i]
    need(isObj(from)&&from.round===calc.round &&
      ['gearVsSequential','shuffleVsSequential'].every(k=>
        calc[k]===null?from[k]===null:close(from[k],calc[k])),
      'inconsistent paired-round ratio')
  }
  if(valid.length){
    validateStats(p.gearVsSequential,valid.map(r=>r.gearVsSequential),'gear paired ratio')
    validateStats(p.shuffleVsSequential,valid.map(r=>r.shuffleVsSequential),'shuffle paired ratio')
  }else need(p.gearVsSequential===null&&p.shuffleVsSequential===null,
    'unsupported unmeasured ratios')
  return {settings:s,summaries:input.summaries,positions,paired,
    rounds:input.measuredRounds,audits:input.referenceAudits,
    allAuditsClaimPass:true}
}
export function convertNbgQm2Receipt(receipt){
  need(isNbgQm2Receipt(receipt),'not an NBG-QM2 receipt')
  const checked=validateReceipt(receipt),s=checked.settings
  const basis=[
    {id:'qm2-protocol',type:'module',group:'architecture',
      label:'NBG QM2 experimental protocol',status:'SELF_REPORTED_SIMULATED_INPUTS',
      claim_boundary:'Synthetic SHA-256d full-domain software benchmark, not quantum or Bitcoin network mining.',
      qm2_detail:{rounds:s.rounds,domain:s.universe,bits:s.bits,
        warmup:s.warmup,method:receipt.method}},
    ...METHODS.map(method=>{
      const data=checked.summaries.find(row=>row.strategy===method)
      return {id:'qm2-'+method.toLowerCase(),type:'evidence_anchor',group:'evidence',
        label:method==='NBG_GEAR'?'NBG Gear scheduler':method==='SEEDED_SHUFFLE'?'Seeded shuffle scheduler':'Sequential scheduler',
        status:'SELF_REPORTED_SOFTWARE_MEASUREMENT',
        claim_boundary:'Local software runtime only. Statistics descriptive, with no established crypto search or quantum advantage.',
        qm2_detail:{rounds:s.rounds,hashes:data.totalHashes,
          medianHashesPerSecond:data.throughput.median,
          q1HashesPerSecond:data.throughput.q1,q3HashesPerSecond:data.throughput.q3,
          coefficientOfVariation:data.throughput.coefficientOfVariation,
          positions:checked.positions[method]}}}),
    {id:'qm2-audit',type:'evidence_anchor',group:'evidence',
      label:'Reported hash verification controls',status:'SELF_REPORTED_CHECKS',
      claim_boundary:'Structural consistency checked on import. AQLEN has NOT independently rehashed the SHA-256 nonce space.',
      qm2_detail:{rounds:s.rounds,referenceHashes:s.universe*s.rounds,
        reportedAuditsPass:checked.allAuditsClaimPass}},
    {id:'qm2-paired',type:'evidence_anchor',group:'evidence',
      label:'Paired rate distributions',status:'DESCRIPTIVE_NOT_SIGNIFICANCE',
      claim_boundary:'Median rate ratios are descriptive and do not establish statistical significance or lower SHA-256 search complexity.',
      qm2_detail:{gearVsSequentialMedian:receipt.pairedComparisons.gearVsSequential?.median??null,
        shuffleVsSequentialMedian:receipt.pairedComparisons.shuffleVsSequential?.median??null}},
  ]
  const nodes=basis.map(row=>({...row,source_status:'IMPORTED_NBG_QM2_UNTRUSTED',
    warnings:[BOUNDARY,row.claim_boundary]}))
  const edges=[...METHODS.map((m,i)=>({id:'qm2-edge-'+i,source:'qm2-'+m.toLowerCase(),
    target:'qm2-protocol',type:'derived_from',label:'Reported under frozen protocol'})),
    {id:'qm2-edge-audit',source:'qm2-audit',target:'qm2-protocol',
      type:'derived_from',label:'Self-reported verification checks'},
    {id:'qm2-edge-paired',source:'qm2-paired',target:'qm2-protocol',
      type:'derived_from',label:'Self-reported paired trial summary'}]
  return {
    dashboard_payload_version:'v0.7-qm2-receipt-adapter',
    graph_id:'nbg-qm2-local-'+s.seed+'-'+s.rounds+'x'+s.universe,
    graph_version:'v1.0.0',
    summary_cards:{node_count:nodes.length,edge_count:edges.length,
      boundary_count:nodes.length},
    boundary_cards:nodes.map(n=>({node_id:n.id,boundary:n.claim_boundary,severity:'warning'})),
    focus_trace:{focus_id:'qm2-protocol',upstream:[],downstream:[]},
    global_claim_boundary:BOUNDARY,
    nodes,edges,imported_from:'NBG_QM2_READ_ONLY',
  }
}
