# v0.6 Validation Commands Quickstart

Run the full fixture suite:

```bash
python tools/validate_dashboard_fixture_suite.py
```

Run the full fixture suite as JSON:

```bash
python tools/validate_dashboard_fixture_suite.py --json
```

Validate one payload:

```bash
python tools/validate_dashboard_payload.py dashboard/receipt_graph_dashboard_demo.json
```

Validate one negative fixture:

```bash
python tools/validate_dashboard_payload.py dashboard/fixtures/negative_broken_edge_link.json
```

Expected result: the negative fixture should fail.

## Local renderer check

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/dashboard/receipt_graph_renderer_v0_4.html
```

## Boundary

These commands check payload structure and claim-boundary preservation. They do not prove scientific claims.
