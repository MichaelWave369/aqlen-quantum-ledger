# Roadmap — Dashboard Validation v0.7 Schema Alignment

Next target after v0.6 CI and negative fixtures.

## Build sequence

1. Create dashboard payload JSON schema.
2. Add schema documentation.
3. Add validation report generator.
4. Add expected report artifacts for positive/negative/warning fixtures.
5. Wire report generation into CI if useful.

## Primary command to preserve

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Candidate new command

```bash
python tools/write_dashboard_validation_report.py --out dashboard/validation_reports/latest.json
```

## Principle

Do not let schema work replace the lightweight validator. The schema should clarify the payload contract; the validator should remain the fast operator-friendly guardrail.
