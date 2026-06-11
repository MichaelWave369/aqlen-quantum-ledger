# AQLEN Graph Renderer v0.4 — Detail and Evidence Polish

Status: prototype
Scope: local-first dashboard renderer
Primary file: `dashboard/receipt_graph_renderer_v0_4.html`

## Purpose

Graph Renderer v0.4 turns the receipt graph dashboard from a visual layout prototype into a more useful inspection surface.

The goal is not to make scientific claims stronger. The goal is to make the existing ledger evidence, claim boundaries, node statuses, and edge relationships easier to inspect.

## New capabilities

- Dedicated v0.4 renderer file, preserving the v0.3 renderer as a stable baseline.
- Source/status legend generated from the loaded node payload.
- Rich selected-node detail panel showing the raw node fields.
- Selected-edge detail panel showing the raw edge fields.
- Edge-card click inspection.
- Focus presets for common inspection modes:
  - readiness score
  - first evidence anchor
  - first error/noise node
  - first calibration node
- Compact evidence-oriented layout mode.
- Pipeline lane layout mode.
- Radial trace layout mode.
- Trace-only mode.
- Search across nodes and edges.
- Group and edge-type filters.
- Focused-trace JSON export.
- Print mode for screenshot/report workflows.
- Boundary cards combined with node-level claim-boundary warnings.

## Claim boundary

The renderer is an interface over ledger payloads. It must not imply:

- that AQLEN has solved practical quantum computing;
- that a readiness score is proof of fault-tolerant deployment;
- that visual proximity equals scientific causality;
- that a node's presence in a graph proves the underlying research claim;
- that UI styling raises confidence beyond the source-status metadata.

Every graph view should keep the global claim boundary visible and preserve node-level warnings.

## Local run

From the repo root:

```bash
python -m http.server 8000
```

Then open:

```txt
http://localhost:8000/dashboard/receipt_graph_renderer_v0_4.html
```

Click **Load demo export** to load `dashboard/receipt_graph_dashboard_demo.json`.

## Recommended inspection sequence

1. Load the demo export.
2. Switch between Pipeline, Radial, and Compact layouts.
3. Click a readiness-score node.
4. Toggle Trace only.
5. Click an evidence node.
6. Click an edge card.
7. Review the selected-node and selected-edge panels.
8. Use the status legend to confirm source/status classes.
9. Enter Print mode and verify boundary visibility.
10. Export the focused trace JSON.

## v0.5 target

The next renderer pass should focus on validation and polish:

- fixture payloads for multiple focus modes;
- dashboard smoke tests;
- no-broken-edge warnings;
- missing-node warnings;
- graph screenshot/export workflow;
- better edge hover/click behavior directly on the SVG graph;
- visual distinction between evidence support, correlation, hypothesis, and implementation links.
