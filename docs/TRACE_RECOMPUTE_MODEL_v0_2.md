# Trace Recompute Model v0.2

Status: prototype model
Applies to: `dashboard/receipt_graph_renderer.html`

## Why this exists

The first dashboard export includes a `focus_trace`, but an interactive renderer needs to let the operator click any node and recalculate the path locally. This document defines the simple v0.2 rule used by the browser renderer.

## Edge direction

Every edge is treated as directed:

```txt
source -> target
```

## Upstream trace

For a selected focus node, upstream trace walks incoming edges backward.

Example:

```txt
calibration_receipt -> readiness_score
```

If the readiness score is focused, the calibration receipt appears upstream because it points into the score.

## Downstream trace

For a selected focus node, downstream trace walks outgoing edges forward.

Example:

```txt
readiness_score -> qubit_receipt
```

If the readiness score is focused, the qubit receipt appears downstream because the score points to the receipt in the demo graph.

## Breadth-first traversal

The v0.2 renderer uses breadth-first traversal with a bounded depth.

Default depth:

```txt
6
```

Allowed range:

```txt
1..12
```

## Exported focused trace

When the operator exports a focused trace, the renderer writes a JSON file containing:

- `exported_at`
- `graph_id`
- `focus_id`
- `global_claim_boundary`
- `focus_trace`
- trace nodes
- trace edges
- boundary cards attached to trace nodes

## Important boundary

The trace is an inspection path, not a proof path.

A trace can show:

- what evidence is connected to a score
- what receipts contribute to a node
- what downstream objects depend on a node

A trace cannot prove:

- that a physical quantum computer is fault tolerant
- that an internal readiness score guarantees quantum advantage
- that an evidence anchor supports every downstream design choice
