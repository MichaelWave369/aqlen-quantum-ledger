export const GROUPS = ["evidence", "device", "error", "calibration", "score", "architecture"];
export const LABELS = { evidence: "Evidence", device: "Device", error: "Noise & Error",
  calibration: "Calibration", score: "Readiness", architecture: "Architecture" };

export function validatePayload(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return ["Payload must be a JSON object."];
  const errors = [];
  if (!Array.isArray(value.nodes)) errors.push("Missing nodes array.");
  if (!Array.isArray(value.edges)) errors.push("Missing edges array.");
  if (typeof value.global_claim_boundary !== "string" || !value.global_claim_boundary.trim()) {
    errors.push("A non-empty global_claim_boundary is mandatory.");
  }
  if (errors.length) return errors;
  if (value.nodes.length > 200 || value.edges.length > 800) errors.push("Limit: 200 nodes and 800 edges for the public viewer.");
  const ids = new Set();
  for (const node of value.nodes) {
    if (!node || !["id","label","group","type","status"].every((key) => typeof node[key] === "string" && node[key].trim())) {
      errors.push("Each node needs non-empty id, label, group, type and status strings.");
      break;
    }
    if (ids.has(node.id)) errors.push("Duplicate node ID: " + node.id);
    ids.add(node.id);
  }
  for (const edge of value.edges) {
    if (!edge || !["id","source","target","label"].every((key) => typeof edge[key] === "string")) {
      errors.push("Each edge needs id, source, target and label strings.");
      break;
    }
    if (!ids.has(edge.source) || !ids.has(edge.target)) errors.push("Dangling graph edge: " + edge.id);
  }
  if (value.boundary_cards !== undefined) {
    if (!Array.isArray(value.boundary_cards)) errors.push("boundary_cards must be an array.");
    else for (const item of value.boundary_cards) {
      if (!item || !ids.has(item.node_id) || typeof item.boundary !== "string" || !item.boundary.trim()) errors.push("Invalid boundary card / missing node.");
    }
  }
  return [...new Set(errors)].slice(0,12);
}
export function connections(payload, id) {
  return payload.edges.filter((edge) => edge.source === id || edge.target === id);
}
export function layoutNodes(nodes) {
  const grouped = Object.create(null);
  const positions = {};
  for (const node of nodes) (grouped[node.group] ??= []).push(node);
  const x = { evidence: 120, device: 340, error: 560, calibration: 780, score: 1000 };
  Object.entries(x).forEach(([group, xValue]) => (grouped[group] || []).forEach((node,i,arr) => {
    positions[node.id] = { x:xValue, y:160 + (i-(arr.length-1)/2)*115 };
  }));
  (grouped.architecture || []).forEach((node,i) => { positions[node.id] = {x:380 + i%3*220,y:420 + Math.floor(i/3)*92}; });
  nodes.filter(node => !positions[node.id]).forEach((node,i) => { positions[node.id] = {x:120+i%5*220,y:530+Math.floor(i/5)*92}; });
  return positions;
}
