# AQLEN Dashboard Export v0.1

## Purpose

This layer converts the minimal AQLEN receipt graph into a frontend-ready JSON payload for dashboard prototypes.

It does not change the scientific claims. It makes the existing receipt graph easier to render, inspect, and audit.

## Input

The exporter expects the receipt graph shape used by `examples/receipt_graph_minimal.json`:

- `nodes[]` with `id`, `type`, `label`, `status`, and optional `claim_boundary`
- `edges[]` with `from`, `to`, `type`, `note`, and optional `weight`

## Output

The dashboard payload includes:

- `summary_cards` for node count, edge count, node type counts, and boundary count
- `nodes` with UI-ready `badge`, `group`, `status`, and warnings
- `edges` with normalized `source`, `target`, labels, notes, and weights
- `focus_trace` for upstream/downstream path inspection around a selected node
- `boundary_cards` for every node that carries a claim boundary
- `global_claim_boundary` so every dashboard view can keep the public-safe framing visible

## Example commands

```bash
python tools/receipt_graph_dashboard_export.py export \
  --graph examples/receipt_graph_minimal.json
```

```bash
python tools/receipt_graph_dashboard_export.py export \
  --graph examples/receipt_graph_minimal.json \
  --focus score-demo-001 \
  --depth 6 \
  --out dashboard/receipt_graph_dashboard_demo.json
```

## Claim boundary

The dashboard export must preserve this principle:

> AQLEN is a research and intelligence architecture for tracking evidence, errors, calibration, and readiness. It is not a claim that practical fault-tolerant quantum computing has been solved.

## Dashboard interpretation

A frontend should treat the exported data as an inspection layer, not a proof layer.

Recommended UI behavior:

1. Show evidence anchors separately from readiness scores.
2. Show claim-boundary warnings wherever a score or research anchor appears.
3. Keep edge labels visible so users understand why two receipts are connected.
4. Allow users to inspect upstream evidence and downstream impact without hiding uncertainty.
5. Never collapse multiple evidence lanes into one unsupported mega-claim.

## v0.2 upgrade path

- Add JSON Schema for dashboard payloads.
- Add deterministic layout hints for graph visualization.
- Add dashboard filters by node type, status, module, and claim boundary.
- Add export variants for Cytoscape, D3, and React Flow.
- Add a claim-boundary badge system for public/private/internal views.
