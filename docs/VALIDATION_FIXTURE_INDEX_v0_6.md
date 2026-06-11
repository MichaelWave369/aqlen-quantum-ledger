# Validation Fixture Index v0.6

## Positive fixtures

- `dashboard/receipt_graph_dashboard_demo.json`
- `dashboard/fixtures/score_focus_demo.json`
- `dashboard/fixtures/evidence_focus_demo.json`
- `dashboard/fixtures/noise_focus_demo.json`

## Negative fixtures

- `dashboard/fixtures/negative_missing_global_boundary.json`
- `dashboard/fixtures/negative_broken_edge_link.json`
- `dashboard/fixtures/negative_duplicate_node_id.json`
- `dashboard/fixtures/negative_boundary_missing_node.json`
- `dashboard/fixtures/negative_focus_trace_missing_node.json`

## Warning fixture

- `dashboard/fixtures/warning_summary_count_drift.json`

## Suite command

```bash
python tools/validate_dashboard_fixture_suite.py
```
