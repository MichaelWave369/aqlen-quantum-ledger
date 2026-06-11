# Graph Layout Model v0.3

## Purpose

The v0.3 graph layout model turns dashboard export data into a visible local graph without adding a database or hosted service.

## Input shape

The renderer expects the dashboard export shape:

```json
{
  "graph_id": "...",
  "summary": "...",
  "global_claim_boundary": "...",
  "summary_cards": {},
  "nodes": [],
  "edges": [],
  "boundary_cards": [],
  "focus_trace": {}
}
```

Nodes should include:

```json
{
  "id": "score-demo-001",
  "label": "QEC Readiness Score",
  "type": "readiness_score",
  "group": "score",
  "status": "prototype",
  "badge": "score",
  "claim_boundary": "..."
}
```

Edges should include:

```json
{
  "id": "edge-001",
  "source": "noise-demo-001",
  "target": "calibration-demo-001",
  "type": "mitigated_by",
  "label": "mitigated by",
  "note": "...",
  "weight": 0.8
}
```

The renderer also accepts older graph edges that use `from` and `to`; those are normalized into `source` and `target` in the browser.

## Pipeline layout logic

The pipeline layout uses node `group` as the main lane value. Preferred lane order:

1. evidence
2. device
3. error
4. calibration
5. score
6. architecture
7. other

Nodes inside each lane are sorted by a simple connection heuristic and then by label. This is not a scientific ranking; it is a readability layout.

## Radial layout logic

The radial layout centers the current focus node:

- focus node: center
- trace nodes: inner ring
- non-trace nodes: outer ring

This makes it easier to inspect upstream support and downstream impact from any selected node.

## Trace model

The browser recomputes the trace locally using the edge list:

- upstream trace walks incoming edges from the focus node
- downstream trace walks outgoing edges from the focus node
- trace depth is controlled by the user
- trace-only mode hides non-trace nodes and non-trace edges

## Boundary model

The visual graph does not create new claim posture. It only displays boundaries already present in the export:

- global claim boundary
- node claim boundary
- node warnings
- boundary cards

Any future evidence-status or confidence visualization should come from structured fields in the export, not from inferred UI decoration alone.
