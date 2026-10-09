import { useMemo, useRef, useState } from "react";
import sample from "../../dashboard/receipt_graph_dashboard_demo.json";
import { GROUPS, LABELS, connections, layoutNodes, validatePayload } from "./graph.js";

const REPO = "https://github.com/MichaelWave369/aqlen-quantum-ledger";
const COLORS = { evidence:"#77ece3",device:"#89bdff",error:"#ffbd8b",calibration:"#c8a8ff",score:"#c8eb90",architecture:"#f2d089" };
const LAYERS = [
  ["01","Qubit Provenance Registry","Device origin, processing and identity."],
  ["02","Temporal Error Memory","Where errors appeared and how they changed."],
  ["03","Predictive Calibration Engine","Research direction for calibration guidance."],
  ["04","Quantum Digital Twin Layer","Model-to-observation comparison."],
  ["05","Manufacturing Intelligence Mesh","Variation, yield and fabrication context."],
  ["06","Quantum Knowledge Graph","Evidence and receipt relationships."],
  ["07","AI-Assisted Calibration Search","Human-reviewed calibration candidates."],
  ["08","Federated Research Grid","Proposed governed evidence exchange."],
  ["09","Human-Reviewed Design Explorer","Design tradeoffs with clear review steps."],
  ["10","Living Quantum Ledger","An auditable history of decisions and updates."],
];
const pretty = (value) => String(value || "").replaceAll("_"," ").replace(/\b\w/g,ch=>ch.toUpperCase());
const clip = (value,size=25) => value.length>size?value.slice(0,size-1)+"…":value;

function Graph({payload, selected, onSelect, matches}) {
  const positions=useMemo(()=>layoutNodes(payload.nodes),[payload]);
  const linked=new Set(connections(payload,selected).map(edge=>edge.id));
  const height=Math.max(520,...Object.values(positions).map(p=>p.y+80));
  return <div className="graph-scroll" tabIndex={0} role="region" aria-label="Interactive receipt graph, scroll to explore">
    <svg viewBox={"0 0 1120 "+height} className="graph-svg" role="img" aria-label="Directed relationships between evidence, devices, errors, calibration and readiness">
      <defs><pattern id="dot-grid" width="27" height="27" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#426078" opacity=".36"/></pattern></defs>
      <rect width="1120" height={height} fill="url(#dot-grid)"/>
      {payload.edges.map(edge=>{
        const a=positions[edge.source],b=positions[edge.target];
        if(!a||!b) return null;
        const active=linked.has(edge.id),dim=!matches.has(edge.source)||!matches.has(edge.target);
        return <path key={edge.id} d={"M"+a.x+" "+(a.y+37)+" C"+a.x+" "+(a.y+100)+" "+b.x+" "+(b.y-95)+" "+b.x+" "+(b.y-38)}
          fill="none" stroke={active?"#f6d68c":"#668499"} strokeWidth={active?3:1.6}
          strokeDasharray={edge.type==="feeds_module"?"5 5":undefined} opacity={dim?.1:active?.98:.46}/>;
      })}
      {payload.nodes.map(node=>{
        const p=positions[node.id],focus=node.id===selected,dim=!matches.has(node.id);
        const color=COLORS[node.group]||"#aebcca";
        return <g key={node.id} className="graph-node" role="button" tabIndex={0}
          aria-label={"Inspect "+node.label} onClick={()=>onSelect(node.id)}
          onKeyDown={event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();onSelect(node.id)}}}
          transform={"translate("+p.x+" "+p.y+")"} opacity={dim?.16:1}>
          <rect x="-94" y="-39" width="188" height="78" rx="10" fill={focus?"#1d3443":"#102230"} stroke={focus?"#fff0bc":color} strokeWidth={focus?2.5:1}/>
          <path d="M-89 -29 V29" stroke={color} strokeWidth="4" strokeLinecap="round"/>
          <text x="-76" y="-17" className="svg-over" fill={color}>{(LABELS[node.group]||pretty(node.group)).toUpperCase()}</text>
          <text x="-76" y="7" className="svg-title" fill="#f3f8fd">{clip(node.label)}</text>
          <text x="-76" y="25" className="svg-small" fill="#92aabd">{clip(pretty(node.status),24)}</text>
          {focus&&<circle cx="79" cy="-26" r="4" fill="#ffdc88"/>}
        </g>;
      })}
    </svg>
  </div>;
}

export default function App() {
  const [payload,setPayload]=useState(sample);
  const [selected,setSelected]=useState(sample.focus_trace?.focus_id||sample.nodes[0]?.id);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const [label,setLabel]=useState("PUBLIC DEMO DATA");
  const [notice,setNotice]=useState("");
  const input=useRef(null);
  const current=payload.nodes.find(node=>node.id===selected)||payload.nodes[0];
  const related=current?connections(payload,current.id):[];
  const matches=useMemo(()=>new Set(payload.nodes.filter(node=>(filter==="all"||node.group===filter)&&
    (node.label+" "+node.id+" "+node.type+" "+node.status).toLowerCase().includes(search.trim().toLowerCase())
  ).map(node=>node.id)),[payload,filter,search]);
  const warned=payload.nodes.filter(node=>node.claim_boundary||(node.warnings||[]).length).length;
  const stats=[["GRAPH NODES",payload.nodes.length],["LINKED EDGES",payload.edges.length],
    ["BOUNDARY FLAGS",warned],["MODULE NODES",payload.nodes.filter(n=>n.group==="architecture").length]];

  async function importJson(event) {
    const file=event.target.files?.[0];if(!file)return;
    try {
      if(file.size>2_000_000)throw Error("Select a file under 2 MB.");
      const value=JSON.parse(await file.text());
      const errors=validatePayload(value);
      if(errors.length)throw Error(errors.join(" "));
      setPayload(value);setSelected(value.nodes.some(n=>n.id===value.focus_trace?.focus_id)?value.focus_trace.focus_id:value.nodes[0]?.id);
      setFilter("all");setSearch("");setLabel("LOCAL / "+file.name);
      setNotice("Opened in this browser session only. Not uploaded and not scientifically verified.");
    } catch(e){setNotice("Import rejected: "+e.message)}
    finally {event.target.value=""}
  }
  function reset(){setPayload(sample);setSelected(sample.focus_trace?.focus_id||sample.nodes[0]?.id);
    setFilter("all");setSearch("");setLabel("PUBLIC DEMO DATA");setNotice("Bundled sample restored.");}

  return <div className="site" id="top">
    <header className="nav">
      <a href="#top" className="brand"><span className="brand-symbol">Ω</span><span><b>AQLEN</b><small>QUANTUM LEDGER</small></span></a>
      <nav aria-label="Site sections"><a href="#explorer">Explorer</a><a href="#architecture">Architecture</a><a href="#boundaries">Claim boundaries</a></nav>
      <a href={REPO} className="repository" target="_blank" rel="noopener noreferrer">GitHub repository ↗</a>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse"/> OPEN RESEARCH / AQLEN Ω / LOCAL-FIRST</p>
          <h1>Trace the error.<br/><em>Keep the evidence.</em></h1>
          <p className="lead">An evidence-aware ledger for the journey from silicon spin-qubit hardware provenance through noise, calibration history and quantum-error-correction readiness.</p>
          <div className="actions"><a href="#explorer" className="btn primary">Explore the ledger <span>↗</span></a><a href={REPO+"/blob/main/docs/V0_2_10_LAYER_ARCHITECTURE.md"} className="btn outlined" target="_blank" rel="noopener noreferrer">Read the architecture</a></div>
          <p className="caption">RESEARCH ARCHITECTURE · ILLUSTRATIVE RECEIPTS · NOT A LIVE QUANTUM DEVICE</p>
        </div>
        <div className="hero-visual" aria-hidden="true"><div className="ring ring-one"/><div className="ring ring-two"/><div className="ring ring-three"/><div className="core">Ω</div><span className="orb-label one">PROVENANCE</span><span className="orb-label two">ERROR MEMORY</span><span className="orb-label three">READINESS</span></div>
      </section>

      <section className="stats" aria-label="Illustrative graph counts">
        {stats.map(([name,value],i)=><div className="stat" key={name}><span>0{i+1}</span><strong>{String(value).padStart(2,"0")}</strong><small>{name}</small></div>)}
      </section>

      <section className="explorer-section" id="explorer">
        <div className="heading"><div><p className="eyebrow">INSTRUMENT 001 / RECEIPT EXPLORER</p><h2>Follow the chain of evidence.</h2><p>Inspect how research anchors, device receipts, noise events and calibration actions connect.</p></div><span className="data-label"><span className="pulse"/>{label}</span></div>
        <div className="toolbar">
          <input type="search" aria-label="Search graph records" placeholder="Search node labels, IDs, status…" value={search} onChange={e=>setSearch(e.target.value)} />
          <select aria-label="Filter node category" value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">All node types</option>
            {GROUPS.map(group=><option value={group} key={group}>{LABELS[group]}</option>)}
          </select>
          <button onClick={()=>input.current?.click()}>Import JSON ↑</button><button className="quiet" onClick={reset}>Reset demo</button>
          <input ref={input} type="file" accept=".json,application/json" hidden onChange={importJson}/>
        </div>
        {notice&&<div className="notice" role="status">{notice}</div>}
        <div className="workspace">
          <div className="graph-column">
            <div className="pane-heading"><span>GRAPH / {payload.graph_id||"LOCAL FILE"}</span><span>{matches.size} MATCHING NODES · CLICK TO INSPECT</span></div>
            <Graph payload={payload} selected={current?.id} onSelect={setSelected} matches={matches}/>
            <div className="graph-note">Connections represent receipt relationships, not physical quantum circuitry. Dimmed nodes do not match the filter.</div>
          </div>
          <aside className="inspector">
            <p className="inspector-title">RECEIPT INSPECTOR <span>↗</span></p>
            {current?<><span className="kind" style={{"--kind":COLORS[current.group]||"#aebcca"}}>{LABELS[current.group]||pretty(current.group)}</span>
              <h3>{current.label}</h3><code>{current.id}</code>
              <dl><div><dt>TYPE</dt><dd>{pretty(current.type)}</dd></div><div><dt>STATUS</dt><dd>{pretty(current.status)}</dd></div><div><dt>LINKED RECORDS</dt><dd>{related.length}</dd></div></dl>
              <h4>Connected records</h4>
              <div className="relations">{related.length?related.map(edge=>{
                const target=edge.source===current.id?edge.target:edge.source;
                const node=payload.nodes.find(n=>n.id===target);
                return <button key={edge.id} onClick={()=>setSelected(target)}><small>{edge.source===current.id?"OUTBOUND":"INBOUND"} · {edge.label}</small><strong>{node?.label||target} ↗</strong></button>
              }):<p>No connected receipts in this payload.</p>}</div>
              {(current.claim_boundary||(current.warnings||[]).length>0)&&<div className="warning"><strong>Claim boundary</strong><p>{current.claim_boundary||current.warnings[0]}</p></div>}
            </>:<p>No graph nodes to inspect.</p>}
          </aside>
        </div>
        <p className="privacy"><strong>Local-first by design.</strong> The public dataset is illustrative. Imported JSON remains in browser memory, with no upload or server processing. Structural validation is not scientific verification, and the dashboard cannot control quantum hardware.</p>
      </section>

      <section className="architecture-section" id="architecture">
        <div className="heading"><div><p className="eyebrow">ARCHITECTURE / v0.2</p><h2>Ten layers. One traceable record.</h2><p>The proposed components of AQLEN Ω, from provenance to governed research intelligence.</p></div><a className="spec-link" href={REPO+"/blob/main/docs/V0_2_10_LAYER_ARCHITECTURE.md"} target="_blank" rel="noopener noreferrer">Full specification ↗</a></div>
        <div className="layers">{LAYERS.map(([n,title,desc])=><article className="layer" key={n}><span>{n} / 10</span><h3>{title}</h3><p>{desc}</p></article>)}</div>
      </section>
      <section className="boundary-section" id="boundaries"><div><p className="eyebrow">BOUNDARIES ARE PART OF THE DATA</p><h2>Make uncertainty visible.</h2><p>{payload.global_claim_boundary}</p><p>Readiness metrics are research aids, not proof of quantum advantage, system-level fault tolerance or deployment readiness.</p><a href={REPO+"/blob/main/docs/CLAIM_BOUNDARY_MATRIX.md"} target="_blank" rel="noopener noreferrer">Explore the claim-boundary matrix ↗</a></div><div className="boundary-symbol" aria-hidden="true">≠<small>SCORE ≠ PROOF</small></div></section>
    </main>
    <footer><span><b>AQLEN Ω</b> / Adaptive Quantum Ledger Evolution Network</span><span>Illustrative research interface · MIT software license</span><a href={REPO} target="_blank" rel="noopener noreferrer">Source code ↗</a></footer>
  </div>;
}
