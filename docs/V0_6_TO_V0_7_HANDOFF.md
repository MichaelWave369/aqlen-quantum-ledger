# v0.6 to v0.7 Handoff

v0.6 created the CI-ready dashboard validation layer.

v0.7 should create the formal payload contract and report artifacts.

## Preserve

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Add next

- `schemas/dashboard_payload.schema.json`
- `tools/write_dashboard_validation_report.py`
- `dashboard/validation_reports/latest.json` generated locally, if desired
- expected report examples for positive, negative, and warning lanes

## Do not remove

- dependency-free validator,
- negative fixtures,
- warning fixture,
- claim-boundary checks,
- global boundary requirement.
