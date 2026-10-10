// Read-only, narrow adapter for NBG-QM1 evidence graphs.
// The AQLEN viewer never infers physical qubit results or grants scientific approval.
const NODE_IDS=['module-qm1','evidence-pow','evidence-grover']
const BOUNDARY='NBG-QM1 SIMULATED / SOFTWARE-ONLY demonstration; no hardware, mining, quantum advantage, qubit provenance, calibration or model verification.'
export function isNbgQm1Graph(data){
  return Boolean(data&&typeof data==='object'&&!Array.isArray(data)&&
    typeof data.graph_id==='string'&&data.graph_id.startsWith('nbg-qm1-bridge-'))
}
export function convertNbgQm1Graph(graph){
  if(!isNbgQm1Graph(graph))throw new Error('Not an NBG-QM1 graph')
  if(!/^nbg-qm1-bridge-\d{1,5}$/.test(graph.graph_id)||graph.version!=='v0.1.0')
    throw new Error('Unsupported NBG-QM1 graph identity or version')
  if(!Array.isArray(graph.nodes)||graph.nodes.length!==3||
    !Array.isArray(graph.edges)||graph.edges.length!==2)
    throw new Error('NBG-QM1 expects three bounded nodes and two evidence edges')
  const nodes=new Map()
  for(const node of graph.nodes){
    if(!node||!NODE_IDS.includes(node.id)||nodes.has(node.id)||
      typeof node.label!=='string'||!node.label.trim()||
      typeof node.claim_boundary!=='string'||!node.claim_boundary.trim())
      throw new Error('Invalid or unbounded NBG-QM1 evidence node')
    if(node.type!==(node.id==='module-qm1'?'module':'evidence_anchor'))
      throw new Error('Incorrect evidence node type')
    if(node.id==='evidence-pow'){
      if(!['SOFTWARE_MEASUREMENT','NOT_RUN'].includes(node.status))
        throw new Error('PoW evidence cannot claim verified hardware authority')
      if(node.measured_results!==undefined){
        if(!Array.isArray(node.measured_results)||
          node.measured_results.length!==3||
          !['SEQUENTIAL','SEEDED_SHUFFLE','NBG_GEAR'].every(name=>
            node.measured_results.some(row=>row?.strategy===name&&
              Number.isInteger(row.budget)&&row.budget>0&&
              row.energy==='NOT_MEASURED'&&
              (row.hashesPerSecond===null||
                typeof row.hashesPerSecond==='number'&&
                Number.isFinite(row.hashesPerSecond)&&row.hashesPerSecond>=0)))
          throw new Error('Invalid equal-strategy software measurement summary')
      }
      if(node.status==='SOFTWARE_MEASUREMENT'&&
        node.measured_results?.length!==3)
        throw new Error('Software measurement must include three summaries')
      if(node.status==='NOT_RUN'&&node.measured_results?.length)
        throw new Error('NOT_RUN fixture cannot invent measurements')
    }else if(node.status!=='SIMULATED')
      throw new Error('Non-measurement node cannot claim scientific authority')
    if(node.id==='evidence-grover'){
      const sim=node.simulated_results
      if(sim!==undefined&&(!sim||!Number.isInteger(sim.qubits)||sim.qubits<2||sim.qubits>8||
        !Number.isInteger(sim.oracleCalls)||sim.oracleCalls<0||
        typeof sim.successProbability!=='number'||sim.successProbability<0||
        sim.successProbability>1))
        throw new Error('Invalid toy Grover simulator summary')
    }
    nodes.set(node.id,node)
  }
  for(const edge of graph.edges){
    if(!edge||edge.type!=='derived_from'||
      !['evidence-pow','evidence-grover'].includes(edge.from)||
      edge.to!=='module-qm1')
      throw new Error('Unapproved external ledger edge')
  }
  if(new Set(graph.edges.map(row=>row.from)).size!==2)
    throw new Error('Missing independent evidence edge')
  const payloadNodes=NODE_IDS.map(id=>{
    const item=nodes.get(id)
    return {
      id:item.id,type:item.type,label:item.label,
      group:item.type==='module'?'architecture':'evidence',
      status:item.status,
      claim_boundary:item.claim_boundary,
      source_status:'EXTERNAL_NBG_QM1_LOCAL_ONLY',
      warnings:[BOUNDARY,item.claim_boundary],
      // Details are inert graph data, never a scientific authority signal.
      qm1_summary:id==='evidence-pow'?item.measured_results??[]:
        id==='evidence-grover'?item.simulated_results??null:null,
    }
  })
  const payloadEdges=graph.edges.map((e,i)=>({
    id:'qm1-link-'+(i+1),source:e.from,target:e.to,
    type:e.type,label:'Derived from (simulation only)',
  }))
  return {
    dashboard_payload_version:'v0.7-qm1-local-adapter',
    graph_id:graph.graph_id,
    graph_version:graph.version,
    summary_cards:{node_count:payloadNodes.length,edge_count:payloadEdges.length,
      boundary_count:payloadNodes.length},
    boundary_cards:payloadNodes.map(n=>({node_id:n.id,boundary:n.claim_boundary,
      severity:'warning'})),
    focus_trace:{focus_id:'module-qm1',upstream:[],downstream:[]},
    global_claim_boundary:BOUNDARY,
    nodes:payloadNodes,edges:payloadEdges,
    imported_from:'NBG_QM1_READ_ONLY',
  }
}
