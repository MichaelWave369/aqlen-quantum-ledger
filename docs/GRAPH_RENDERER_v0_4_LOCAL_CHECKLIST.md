# Graph Renderer v0.4 Local Checklist

Use this checklist after opening `dashboard/receipt_graph_renderer_v0_4.html` from a local server.

## Startup

- [ ] Start local server from repo root: `python -m http.server 8000`
- [ ] Open `http://localhost:8000/dashboard/receipt_graph_renderer_v0_4.html`
- [ ] Click **Load demo export**
- [ ] Confirm the global claim boundary appears in the header banner

## Layouts

- [ ] Pipeline lanes layout renders nodes in evidence/device/error/calibration/score/architecture lanes
- [ ] Radial trace layout places the focus node at center
- [ ] Compact evidence view renders without breaking edge labels

## Focus and trace

- [ ] Clicking a graph node changes the selected focus
- [ ] Clicking a node card changes the selected focus
- [ ] Trace JSON updates after focus changes
- [ ] Depth changes update upstream/downstream trace reach
- [ ] Trace-only mode hides non-trace nodes and edges

## Search and filters

- [ ] Search finds node labels and IDs
- [ ] Search finds edge notes and edge types
- [ ] Node group filter narrows visible nodes
- [ ] Edge type filter narrows visible edges
- [ ] Filters do not hide the global claim boundary

## Evidence/status polish

- [ ] Source/status legend appears
- [ ] Node status appears on graph nodes and cards
- [ ] Node claim-boundary warnings remain visible
- [ ] Boundary cards show payload and node-level warnings

## Edge inspection

- [ ] Clicking an edge card updates the selected-edge panel
- [ ] Selected edge is visually highlighted
- [ ] Edge notes are visible in edge cards

## Print/report mode

- [ ] Print mode hides controls and side panels
- [ ] Graph remains visible
- [ ] Claim-boundary banner remains visible before print mode or can be captured separately
- [ ] Exiting print mode restores controls

## Known limitations

- SVG edge paths are visual only; direct edge clicking currently happens through edge cards.
- Layout is deterministic but not physics-based.
- The renderer does not validate scientific correctness.
- The renderer does not prove causality; it visualizes declared ledger relationships.
