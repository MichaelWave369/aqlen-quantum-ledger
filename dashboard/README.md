# AQLEN Dashboard

This folder holds local dashboard artifacts for inspecting AQLEN receipt graph exports.

## Current files

```text
receipt_graph_dashboard_demo.json
receipt_graph_renderer.html
```

## Run locally

From the repository root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/dashboard/receipt_graph_renderer.html
```

## Regenerate the demo payload

```bash
python tools/receipt_graph_dashboard_export.py export \
  --graph examples/receipt_graph_minimal.json \
  --focus score-demo-001 \
  --depth 6 \
  --out dashboard/receipt_graph_dashboard_demo.json
```

## Initial panels

1. Evidence anchors
2. Qubit provenance receipts
3. Noise-origin events
4. Calibration drift receipts
5. Readiness score traces
6. Claim-boundary warnings
7. Architecture module paths

## Dashboard principles

1. Keep claim boundaries visible.
2. Keep evidence/source status visible.
3. Keep readiness scores traceable back to evidence, device receipts, noise events, and calibration receipts.
4. Treat all outputs as research-intelligence views, not proof of deployed fault-tolerant quantum computing.
5. Preserve local-first inspection until the system is ready for a real app shell.

## Design principle

Every visual metric should point back to a receipt, evidence anchor, or explicit assumption.

No orphan claims. No unexplained scores.
