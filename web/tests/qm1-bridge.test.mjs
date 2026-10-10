import {test} from 'node:test'
import assert from 'node:assert/strict'
import {isNbgQm1Graph,convertNbgQm1Graph} from '../src/qm1Bridge.js'
import {validatePayload} from '../src/graph.js'

const sample={
  graph_id:'nbg-qm1-bridge-369',version:'v0.1.0',
  summary:'Demo fixture only',
  nodes:[
    {id:'module-qm1',type:'module',label:'NBG QM1 Local Research',
      status:'SIMULATED',claim_boundary:'RESEARCH_DEMO_NO_QUANTUM_HARDWARE'},
    {id:'evidence-pow',type:'evidence_anchor',label:'Double SHA-256 schedule comparison',
      status:'SOFTWARE_MEASUREMENT',claim_boundary:'TOY_TARGET_NO_REAL_MINING',
      measured_results:['SEQUENTIAL','SEEDED_SHUFFLE','NBG_GEAR'].map(strategy=>
        ({strategy,budget:128,energy:'NOT_MEASURED',hashesPerSecond:null}))},
    {id:'evidence-grover',type:'evidence_anchor',label:'Toy Grover classical simulation',
      status:'SIMULATED',claim_boundary:'NO_REAL_QPU_OR_QUANTUM_SPEEDUP',
      simulated_results:{qubits:6,oracleCalls:5,successProbability:.96}},
  ],
  edges:[
    {from:'evidence-pow',to:'module-qm1',type:'derived_from'},
    {from:'evidence-grover',to:'module-qm1',type:'derived_from'},
  ],
}
const clone=v=>JSON.parse(JSON.stringify(v))
test('NBG graph is converted to a bounded browser-only dashboard payload',()=>{
  assert.equal(isNbgQm1Graph(sample),true)
  const result=convertNbgQm1Graph(sample)
  assert.deepEqual(validatePayload(result),[])
  assert.equal(result.nodes.length,3)
  assert.equal(result.edges.length,2)
  assert.equal(result.boundary_cards.length,3)
  assert.ok(result.global_claim_boundary.includes('SIMULATED'))
  assert.ok(result.nodes.every(n=>n.warnings.some(s=>s.includes('no hardware'))||n.warnings.length>0))
  assert.equal(result.imported_from,'NBG_QM1_READ_ONLY')
})
test('does not alter input graph',()=>{
  const before=clone(sample);convertNbgQm1Graph(sample);assert.deepEqual(sample,before)
})
test('rejects provenance escalation and invalid links',()=>{
  for(const mutate of [
    g=>g.nodes[1].status='VERIFIED',
    g=>g.nodes[0].status='QPU_VERIFIED',
    g=>g.nodes[2].claim_boundary='',
    g=>g.edges[0].type='measured_on',
    g=>g.edges[1].from='module-qm1',
    g=>g.version='v2.0.0',
    g=>g.nodes.push({id:'qubit-real',type:'qubit_receipt'}),
    g=>g.nodes[1].measured_results[0].energy='10.3J',
    g=>g.nodes[1].measured_results[0].budget=0,
  ]){
    const g=clone(sample);mutate(g);assert.throws(()=>convertNbgQm1Graph(g))
  }
})
test('rejects forged top-level object',()=>{
  assert.equal(isNbgQm1Graph({nodes:[]}),false)
  assert.throws(()=>convertNbgQm1Graph({}),/Not an NBG-QM1 graph/)
})
