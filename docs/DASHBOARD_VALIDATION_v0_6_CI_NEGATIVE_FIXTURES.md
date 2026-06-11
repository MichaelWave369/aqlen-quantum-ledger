# AQLEN Dashboard Validation v0.6 — CI and Negative Fixtures

Status: v0.6 prototype  
Scope: dashboard payload validation, negative fixtures, warning fixtures, and CI-ready commands

## Purpose

v0.5 introduced a lightweight dashboard payload validator. v0.6 adds a fixture-suite runner so the project can prove that the validator accepts known-good payloads and rejects intentionally broken payloads.

This matters because the dashboard is part of the claim-boundary surface. A rendered graph must not silently hide broken source links, missing claim boundaries, duplicate nodes, or corrupted focus traces.

## Files added in v0.6

```text
tools/validate_dashboard_fixture_suite.py

dashboard/fixtures/negative_missing_global_boundary.json
dashboard/fixtures/negative_broken_edge_link.json
dashboard/fixtures/negative_duplicate_node_id.json
dashboard/fixtures/negative_boundary_missing_node.json
dashboard/fixtures/negative_focus_trace_missing_node.json
dashboard/fixtures/warning_summary_count_drift.json

examples/graph_renderer_v0_6_ci_validation_commands.json
```

## Positive fixture expectation

Positive fixtures should pass with `ok: true`.

Default positive fixtures:

```text
dashboard/receipt_graph_dashboard_demo.json
dashboard/fixtures/score_focus_demo.json
dashboard/fixtures/evidence_focus_demo.json
dashboard/fixtures/noise_focus_demo.json
```

## Negative fixture expectation

Negative fixtures should fail validation and include the expected error fragments.

| Fixture | Intended failure |
|---|---|
| `negative_missing_global_boundary.json` | Missing required global claim boundary |
| `negative_broken_edge_link.json` | Edge source/target references missing nodes |
| `negative_duplicate_node_id.json` | Duplicate node ID |
| `negative_boundary_missing_node.json` | Boundary card points at missing node |
| `negative_focus_trace_missing_node.json` | Focus trace references a missing node |

## Warning fixture expectation

Warning fixtures should remain valid but surface warnings.

| Fixture | Intended warning |
|---|---|
| `warning_summary_count_drift.json` | Summary count differs from actual node/edge count |

## Local commands

Run one payload:

```bash
python tools/validate_dashboard_payload.py dashboard/receipt_graph_dashboard_demo.json
```

Run the full fixture suite:

```bash
python tools/validate_dashboard_fixture_suite.py
```

Run machine-readable suite output:

```bash
python tools/validate_dashboard_fixture_suite.py --json
```

## CI-ready command

The suite exits non-zero if:

- a positive fixture fails,
- a negative fixture unexpectedly passes,
- a negative fixture fails for the wrong reason,
- a warning fixture does not produce the expected warning,
- a warning fixture becomes a hard failure.

This command is safe for CI:

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Claim-boundary rule

A payload can be visually impressive and still be invalid. v0.6 treats source integrity and claim-boundary visibility as validation requirements, not optional UI decoration.

The validator does not prove that the underlying scientific claims are true. It only checks whether the dashboard payload preserves the ledger structure needed for honest inspection.
