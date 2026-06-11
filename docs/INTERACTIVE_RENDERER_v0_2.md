# AQLEN Receipt Graph Interactive Renderer v0.2

Status: prototype
Scope: local-first dashboard inspection

## Purpose

The interactive renderer turns the dashboard export into a locally inspectable receipt graph. It is intentionally lightweight: one HTML file, no external dependencies, and no network upload requirement.

The renderer supports the current dashboard export shape:

- `nodes`
- `edges`
- `summary_cards`
- `boundary_cards`
- `focus_trace`
- `global_claim_boundary`

## v0.2 capabilities

- Load the demo dashboard payload.
- Upload a local JSON export.
- Paste a JSON export directly into the page.
- Click any node card to make it the current focus.
- Recompute upstream and downstream trace paths in the browser.
- Filter nodes by group.
- Filter edges by edge type.
- Search across node IDs, labels, types, statuses, warnings, edge IDs, edge labels, and edge notes.
- Change trace depth from 1 to 12.
- Export the currently focused trace as a small JSON file.
- Keep the global claim boundary visible at the top of the interface.
- Keep node-level claim boundaries visible on node cards and selected-node details.

## Local run

From the repository root:

```bash
python -m http.server 8000
```

Open:

```txt
http://localhost:8000/dashboard/receipt_graph_renderer.html
```

The page will try to load:

```txt
dashboard/receipt_graph_dashboard_demo.json
```

If the browser blocks local fetches or the server is not running, use the file upload or paste flow.

## Interaction model

The renderer treats every edge as directed:

```txt
source -> target
```

For a selected focus node:

- upstream trace walks incoming edges backward to their sources
- downstream trace walks outgoing edges forward to their targets

This lets the dashboard answer first-order ledger questions:

- What evidence or calibration path supports this score?
- What downstream objects depend on this evidence anchor?
- Which module receives a noise event?
- Which calibration receipt updates a readiness score?

## Boundary posture

The renderer is not a scientific proof engine. It is a visibility layer for the receipt graph.

Required boundary posture:

> AQLEN is a research and intelligence architecture for tracking evidence, errors, calibration, and readiness. It is not a claim that practical fault-tolerant quantum computing has been solved.

## Next pass

The next renderer pass should add:

- a real graph layout view
- saved focus presets
- URL hash focus state
- source-status legend
- fixture payloads for each focus mode
- smoke tests for expected DOM sections
- stronger empty-state handling
