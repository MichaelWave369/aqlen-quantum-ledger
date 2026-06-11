# Dashboard Validation Triage Guide

Use this guide when `tools/validate_dashboard_payload.py` or `tools/validate_dashboard_fixture_suite.py` reports an error or warning.

## Broken edge source or target

Message pattern:

```text
edge <id> source not found: <node_id>
edge <id> target not found: <node_id>
```

Meaning: an edge points to a node that is not present in the payload.

Fix path:

1. Confirm whether the missing node should exist.
2. If yes, add the node with `id`, `type`, `label`, `group`, and `status`.
3. If no, remove or correct the edge.

## Duplicate node ID

Message pattern:

```text
duplicate node id: <node_id>
```

Meaning: two node cards use the same ID. This can corrupt focus traces and edge routing.

Fix path:

1. Rename one node to a unique stable ID.
2. Update any edges, boundary cards, and focus trace entries that refer to the renamed node.

## Missing global claim boundary

Message pattern:

```text
missing top-level key: global_claim_boundary
global_claim_boundary must be present and non-empty
```

Meaning: the dashboard payload does not preserve the global claim-boundary posture.

Fix path:

1. Add a `global_claim_boundary` string.
2. Keep it plain and visible.
3. Do not replace it with marketing language.

## Boundary card references missing node

Message pattern:

```text
boundary card references missing node: <node_id>
```

Meaning: a warning card points to a node that the dashboard cannot render.

Fix path:

1. Add the missing node, or
2. update the boundary card to reference the correct node, or
3. remove the boundary card if the underlying node no longer exists.

## Focus trace references missing node or edge

Message pattern:

```text
focus_trace.<direction>[<index>] node not found: <node_id>
focus_trace.<direction>[<index>] edge not found: <edge_id>
```

Meaning: the trace cannot be trusted because it references graph elements that do not exist.

Fix path:

1. Recompute the dashboard export from the current receipt graph.
2. Verify the focus node exists.
3. Verify all trace edge IDs exist in the edge list.

## Summary count drift

Message pattern:

```text
summary_cards.node_count is <x> but actual is <y>
summary_cards.edge_count is <x> but actual is <y>
```

Meaning: the payload is renderable, but the dashboard summary is stale.

Fix path:

1. Regenerate the dashboard export, or
2. manually update `summary_cards.node_count` and `summary_cards.edge_count`.

## Boundary reminder

Passing validation does not mean a scientific claim is proven. It only means the dashboard payload preserves enough structure for local inspection, traceability, and visible claim-boundary review.
