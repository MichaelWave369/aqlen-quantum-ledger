# AQLEN Dashboard Payload Schema v0.7

Status: v0.7 schema alignment pass  
Scope: dashboard export payloads used by the local AQLEN receipt graph renderer

## Purpose

The dashboard payload schema gives the renderer a stable contract without turning the UI into a source of scientific authority.

The schema documents the shape of the data. It does not certify the truth of the data. Confidence remains carried by:

- node `status`
- node `warnings`
- node `claim_boundary`
- `boundary_cards`
- `global_claim_boundary`
- source/evidence metadata provided by the receipt graph

## Schema file

```txt
schemas/dashboard_payload.schema.json
```

The schema is intentionally permissive with `additionalProperties: true` so the dashboard can evolve without breaking older payloads. The validator remains stricter about trust-path integrity.

## Required top-level fields

```txt
dashboard_payload_version
graph_id
graph_version
nodes
edges
summary_cards
boundary_cards
focus_trace
global_claim_boundary
```

## Required node fields

```txt
id
type
label
group
status
```

Optional but strongly encouraged:

```txt
claim_boundary
warnings
source_status
```

A node with a claim boundary should also carry visible warning text so the renderer can avoid silently hiding uncertainty.

## Required edge fields

```txt
id
source
target
type
label
```

Edges must point to existing node IDs. Broken source/target references are fatal validator errors.

## Boundary cards

Boundary cards should point to existing nodes and include non-empty boundary text.

```json
{
  "node_id": "score-demo-001",
  "boundary": "Readiness score is an evidence organization aid, not proof of fault tolerance."
}
```

## Focus trace

Focus traces are generated around a selected node and may include upstream and downstream paths.

Trace items should reference existing nodes and, when present, existing edges.

```json
{
  "node_id": "evidence-demo-001",
  "via_edge_id": "edge-demo-001",
  "depth": 1
}
```

## Claim boundary rule

Every dashboard payload must include a non-empty `global_claim_boundary`.

This is intentional. AQLEN should never render evidence graphs in a way that implies stronger scientific confidence than the source receipts support.

## Validator relationship

The JSON schema documents shape. The Python validator checks trust-path integrity.

Use both:

```bash
python tools/validate_dashboard_payload.py dashboard/receipt_graph_dashboard_demo.json
python tools/validate_dashboard_fixture_suite.py --report-out dashboard/validation_reports/dashboard_fixture_suite_report.json
```

## v0.8 target

The next schema pass should align the exporter, validator, renderer, and fixtures around one shared set of enumerated node groups, edge types, source statuses, and boundary severities.
