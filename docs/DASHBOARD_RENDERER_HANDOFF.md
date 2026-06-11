# Dashboard Renderer Handoff

## What exists now

AQLEN now has a local static renderer for dashboard export payloads.

Main entrypoint:

```text
dashboard/receipt_graph_renderer.html
```

Default demo payload:

```text
dashboard/receipt_graph_dashboard_demo.json
```

## How to inspect

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/dashboard/receipt_graph_renderer.html
```

## What to preserve

- Local-first operation
- Visible global claim boundary
- Visible node-level warnings
- Traceability from readiness scores to upstream receipts and evidence
- No external network dependency
- No production/hardware overclaiming

## Next best build

Interactive Renderer v0.2:

1. Click-to-focus nodes.
2. Dynamic upstream/downstream trace calculation in browser.
3. Search and filters.
4. Export focused trace.
5. Source-status legend.
6. Multiple fixture payloads.

## Why this matters

This renderer makes AQLEN more than a collection of specs. It creates the first inspectable surface where evidence anchors, device receipts, error events, calibration receipts, readiness scores, and module paths can be reviewed together.
