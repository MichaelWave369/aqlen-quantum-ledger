import {test} from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { isNbgQm2Receipt,convertNbgQm2Receipt } from '../src/qm2Bridge.js'
import { validatePayload } from '../src/graph.js'
import { runQM2Experiment,qm2Receipt } from '../../../src/qm2Model.js'

test('QM2 contract: tested canonical receipt from NBG is accepted',async()=>{
  const sha256=async bytes=>new Uint8Array(createHash('sha256').update(bytes).digest())
  let tick=0
  const clock=()=>++tick*.125
  const result=qm2Receipt(await runQM2Experiment({
    universe:32,rounds:3,bits:6,seed:369,warmup:0,sha256,clock,
  }))
  assert.equal(isNbgQm2Receipt(result),true)
  const old=structuredClone(result)
  const payload=convertNbgQm2Receipt(result)
  assert.deepEqual(result,old,'import is read only')
  assert.deepEqual(validatePayload(payload),[])
  assert.equal(payload.imported_from,'NBG_QM2_READ_ONLY')
  assert.equal(payload.nodes.length,6)
  assert.equal(payload.edges.length,5)
  assert.ok(payload.global_claim_boundary.includes('NOT independently recomputed'))
  const bad=[
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
  for(const mutate of bad){
    const forged=structuredClone(result);mutate(forged)
    assert.throws(()=>convertNbgQm2Receipt(forged),/QM2 import rejected:/)
  }
})
test('QM2 foreign format refusal',()=>{
  assert.equal(isNbgQm2Receipt({nodes:[]}),false)
  assert.throws(()=>convertNbgQm2Receipt({schema:'unrelated'}),/not an NBG-QM2 receipt/)
  assert.equal(isNbgQm2Receipt({exportSchema:'nbg.qm2.receipt.v2'}),true)
})
