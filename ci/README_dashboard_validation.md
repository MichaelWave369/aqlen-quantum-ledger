# Dashboard Validation CI

This folder documents CI-facing validation commands for the AQLEN dashboard payloads.

The active GitHub Actions workflow is:

```text
.github/workflows/dashboard-validation.yml
```

The workflow runs:

```bash
python tools/validate_dashboard_fixture_suite.py
```

It is intentionally dependency-free. The suite checks positive fixtures, negative fixtures, and warning fixtures so the dashboard payload validator proves both acceptance and rejection behavior.

## Manual local command

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Machine-readable local command

```bash
python tools/validate_dashboard_fixture_suite.py --json
```

## Boundary

CI verifies payload structure, trace integrity, and claim-boundary preservation. It does not verify scientific truth claims or quantum hardware performance.
