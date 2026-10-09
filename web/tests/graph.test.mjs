import test from "node:test";
import assert from "node:assert/strict";
import { validatePayload, connections, layoutNodes } from "../src/graph.js";

const valid = {
  nodes: [
    { id: "a", label: "Anchor", group: "evidence", type: "anchor", status: "sample" },
    { id: "b", label: "Score", group: "score", type: "score", status: "sample" },
  ],
  edges: [{ id: "e1", source: "a", target: "b", label: "supports" }],
  global_claim_boundary: "Research architecture only.",
  boundary_cards: [{ node_id: "b", boundary: "Score is not proof of fault tolerance." }],
};
test("accepts valid sample graphs", () => {
  assert.deepEqual(validatePayload(valid),[]);
  assert.equal(connections(valid,"b").length,1);
  assert.ok(layoutNodes(valid.nodes).a.x < layoutNodes(valid.nodes).b.x);
});
test("enforces global and node claim boundaries", () => {
  assert.ok(validatePayload({...valid,global_claim_boundary:""}).length);
  assert.ok(validatePayload({...valid,boundary_cards:[{node_id:"missing",boundary:"x"}]}).length);
});
test("rejects duplicated IDs and invalid relationship references", () => {
  assert.ok(validatePayload({...valid,nodes:[...valid.nodes,valid.nodes[0]]}).some(x=>x.includes("Duplicate")));
  assert.ok(validatePayload({...valid,edges:[{...valid.edges[0],target:"missing"}]}).some(x=>x.includes("Dangling")));
});
test("rejects malformed and incomplete documents", () => {
  assert.ok(validatePayload(null).length);
  assert.ok(validatePayload({nodes:[],edges:[]}).length);
});
