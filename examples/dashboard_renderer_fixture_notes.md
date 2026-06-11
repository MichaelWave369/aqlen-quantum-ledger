# Dashboard Renderer Fixture Notes

The v0.1 renderer currently uses:

```text
dashboard/receipt_graph_dashboard_demo.json
```

## Fixture targets for v0.2

Create three additional dashboard export payloads:

1. `dashboard/fixtures/readiness_focus.json`
   - Focus: readiness score
   - Purpose: show score trace upstream and downstream

2. `dashboard/fixtures/evidence_focus.json`
   - Focus: evidence anchor
   - Purpose: show downstream impact from a research anchor

3. `dashboard/fixtures/noise_focus.json`
   - Focus: noise event
   - Purpose: show how an error event connects to calibration and module learning

## Boundary expectations

Each fixture should preserve:

- Global claim boundary
- Node-level warning cards
- Edge notes
- Source-status metadata where available

## Why fixtures matter

Fixtures let the dashboard evolve without confusing demo data with evidence claims. Each fixture is a reviewable scenario, not a production assertion.
