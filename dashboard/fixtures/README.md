# Dashboard Fixtures

This folder contains lightweight fixture manifests for the AQLEN local dashboard renderer.

The manifests describe expected focus behavior against the canonical dashboard payload:

```text
dashboard/receipt_graph_dashboard_demo.json
```

Current fixture manifests:

- `score_focus_demo.json` — readiness-score focus behavior
- `evidence_focus_demo.json` — evidence-anchor focus behavior
- `noise_focus_demo.json` — noise/error focus behavior

These files are intentionally small. They are not full duplicated dashboard exports. Their job is to document what the local renderer should preserve when a reviewer changes focus mode:

- expected focus node
- expected visible boundaries
- source payload path
- local renderer URL

Future v0.6+ work can add full fixture payloads, negative-test payloads, and CI automation.
