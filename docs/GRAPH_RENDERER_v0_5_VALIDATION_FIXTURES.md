# AQLEN Graph Renderer v0.5 — Validation and Fixture Pass

## Purpose

v0.5 moves the dashboard renderer from visual prototype toward trustworthy local inspection.

The goal is not to prove scientific truth. The goal is to make sure every dashboard payload preserves the minimum structure needed for responsible review:

- nodes are unique and typed
- edges connect real nodes
- statuses are visible
- boundary cards point to real nodes
- focus traces reference real nodes and edges
- global claim boundaries stay present
- summary counts do not silently drift

## New validator

```bash
python tools/validate_dashboard_payload.py dashboard/receipt_graph_dashboard_demo.json
```

Machine-readable output:

```bash
python tools/validate_dashboard_payload.py dashboard/receipt_graph_dashboard_demo.json --json
```

Multiple payloads can be checked in one run:

```bash
python tools/validate_dashboard_payload.py \
  dashboard/receipt_graph_dashboard_demo.json \
  dashboard/fixtures/*.json
```

## Validation checks

The validator checks:

1. required top-level dashboard keys
2. node list shape
3. edge list shape
4. duplicate node identifiers
5. duplicate edge identifiers
6. missing edge sources
7. missing edge targets
8. missing or empty global claim boundary
9. boundary cards linked to missing nodes
10. focus trace nodes linked to missing nodes
11. focus trace edges linked to missing edges
12. summary count drift
13. nodes with claim boundaries but no warning text
14. nodes missing useful status metadata

Errors fail the command. Warnings are printed but do not fail unless promoted in a future CI pass.

## Fixture manifests

The `dashboard/fixtures/` folder now includes focus-mode manifests:

- `score_focus_demo.json`
- `evidence_focus_demo.json`
- `noise_focus_demo.json`

These are not full duplicate graph payloads yet. They are lightweight test manifests that describe expected local focus behavior against the canonical demo payload.

## Manual local smoke path

Start the local server:

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000/dashboard/receipt_graph_renderer_v0_4.html
```

Then verify:

1. Load demo payload.
2. Select score focus preset.
3. Confirm global boundary stays visible.
4. Confirm score node warning stays visible.
5. Select evidence focus preset.
6. Confirm evidence boundary stays visible.
7. Select noise focus preset.
8. Confirm trace recalculates without making claims stronger than the payload.
9. Click an edge card and verify source/target/type/note are inspectable.
10. Export focused trace JSON.
11. Enter print mode and confirm boundary cards are still visible.

## v0.5 acceptance target

v0.5 is considered acceptable when:

- the canonical demo payload passes validation
- fixture manifests are present for score, evidence, and noise focus modes
- renderer manual checks preserve claim boundaries
- validation failures are readable by a non-author reviewer
- no dashboard screen implies fault-tolerant deployment, quantum advantage, or autonomous science

## Claim boundary

This validation layer checks payload integrity and review safety. It does not validate the scientific truth of the underlying research anchors or experimental claims. Scientific claims remain evidence-lane dependent and must be reviewed separately.
