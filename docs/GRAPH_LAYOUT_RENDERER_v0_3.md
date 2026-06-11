# AQLEN Receipt Graph Renderer v0.3

## Status

Prototype: local-first visual graph layout.

This pass upgrades the dashboard from a card-first renderer into a visual receipt graph explorer. It still uses the same dashboard export payload and does not require a backend service.

## What v0.3 adds

- SVG edge rendering between receipt nodes.
- Pipeline lane layout grouped by node family.
- Radial trace layout centered on the selected focus node.
- Click-to-focus directly from the graph canvas.
- Trace-highlighted nodes and edges.
- Trace-only view for focused inspection.
- Search, group filter, edge-type filter, and trace depth controls.
- Global claim boundary banner remains visible.
- Node-level claim-boundary markers remain visible.
- Focused trace JSON export now includes the selected layout.

## Supported layouts

### Pipeline lanes

The pipeline layout places nodes into broad receipt families:

1. evidence
2. device
3. error
4. calibration
5. score
6. architecture
7. other

This keeps the visual graph aligned with the AQLEN receipt chain:

```text
evidence anchor -> qubit/device receipt -> noise/error event -> calibration receipt -> readiness score -> architecture/module impact
```

### Radial trace

The radial layout places the selected focus node in the center. Trace nodes are placed on the inner ring and non-trace nodes on the outer ring. This is best for inspecting a specific score, error, or evidence anchor.

## Claim-boundary behavior

The renderer is intentionally conservative:

- It visualizes ledger relationships; it does not prove scientific claims.
- It displays claim-boundary warnings from the payload when present.
- It keeps the global claim boundary visible at the top of the page.
- It separates source/status metadata from visual styling so the UI does not imply stronger evidence than the ledger provides.

## Local usage

From the repository root:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/dashboard/receipt_graph_renderer.html
```

Then click **Load demo export**.

## Recommended next pass

v0.4 should add:

- richer node detail drawer
- source-status legend
- edge hover tooltips
- receipt-path presets
- saved focus states
- screenshot/export support
- fixture exports for score, evidence, and error focus modes
