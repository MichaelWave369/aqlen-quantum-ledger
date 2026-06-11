# Dashboard Validation Reports v0.7

Status: v0.7 report artifact pass  
Scope: local and CI dashboard fixture validation

## Purpose

v0.7 adds a stable machine-readable report path for dashboard validation.

The report is meant to help operators answer three questions:

1. Did known-good dashboard payloads pass?
2. Did intentionally broken payloads fail for the expected reasons?
3. Did warning-only drift stay visible without blocking the build?

## Command

```bash
python tools/validate_dashboard_fixture_suite.py \
  --report-out dashboard/validation_reports/dashboard_fixture_suite_report.json
```

Machine-readable console output:

```bash
python tools/validate_dashboard_fixture_suite.py \
  --json \
  --report-out dashboard/validation_reports/dashboard_fixture_suite_report.json
```

## Report location

```txt
dashboard/validation_reports/dashboard_fixture_suite_report.json
```

The report directory is intended for generated artifacts. Reports should usually not be committed unless a release package explicitly needs a frozen validation receipt.

## Report structure

The report includes:

```txt
suite_version
schema_ref
generated_at
root
ok
summary
positive
negative
warning
```

The `summary` block provides totals for positive, negative, warning, and overall fixture lanes.

## Positive fixtures

Positive fixtures must pass with no fatal validator errors.

Examples:

```txt
dashboard/receipt_graph_dashboard_demo.json
dashboard/fixtures/score_focus_demo.json
dashboard/fixtures/evidence_focus_demo.json
dashboard/fixtures/noise_focus_demo.json
```

## Negative fixtures

Negative fixtures are intentionally broken. They should fail for expected trust-boundary reasons.

Examples:

```txt
missing global claim boundary
broken edge source/target
duplicate node id
boundary card pointing to a missing node
focus trace pointing to a missing node
```

If a negative fixture passes, that is a validator failure.

## Warning fixture

Warning fixtures should remain valid while surfacing operator attention points.

Current example:

```txt
summary count drift
```

This lets the suite distinguish fatal ledger breakage from repairable metadata drift.

## CI integration

The GitHub Actions workflow now writes the report and uploads it as an artifact:

```txt
.github/workflows/dashboard-validation.yml
```

Artifact name:

```txt
dashboard-validation-report
```

## v0.8 target

Next pass should add:

- schema-aware validation report fields
- exporter version metadata
- renderer compatibility metadata
- warning severity categories
- release receipt packaging
