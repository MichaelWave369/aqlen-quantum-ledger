# Dashboard Renderer Smoke Check

Use this quick check after changing dashboard export or renderer files.

## Steps

1. Regenerate the dashboard payload.

```bash
python tools/receipt_graph_dashboard_export.py export \
  --graph examples/receipt_graph_minimal.json \
  --focus score-demo-001 \
  --depth 6 \
  --out dashboard/receipt_graph_dashboard_demo.json
```

2. Serve the repo root.

```bash
python -m http.server 8000
```

3. Open the renderer.

```text
http://localhost:8000/dashboard/receipt_graph_renderer.html
```

4. Confirm the following are visible:

- Global claim boundary banner
- Summary cards
- Node cards
- Edge cards
- Boundary cards
- Focus trace panel

5. Confirm the renderer can also load a pasted or uploaded JSON payload.

## Expected posture

This is a local inspection surface. It should not imply that AQLEN is a production quantum computer, a hardware system, or proof of practical fault-tolerant quantum deployment.
