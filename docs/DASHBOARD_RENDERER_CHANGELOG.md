# Dashboard Renderer Changelog

## v0.1

Added the first local static renderer for dashboard exports.

### Added

- `dashboard/receipt_graph_renderer.html`
- `docs/DASHBOARD_RENDERER_v0_1.md`
- `examples/dashboard_renderer_commands.json`
- `examples/dashboard_renderer_smoke_check.md`
- Updated `dashboard/README.md`

### Capabilities

- Loads `dashboard/receipt_graph_dashboard_demo.json` when served from repo root.
- Supports JSON upload.
- Supports JSON paste.
- Shows summary cards.
- Shows node cards.
- Shows edge cards.
- Shows boundary cards.
- Shows global claim boundary.
- Highlights exported focus trace.

### Boundary posture

The renderer preserves the core AQLEN boundary: this is a research-intelligence architecture for tracing evidence, errors, calibration, and readiness. It is not a claim that practical fault-tolerant quantum computing has been solved.
