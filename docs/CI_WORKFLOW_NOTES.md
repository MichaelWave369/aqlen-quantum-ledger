# CI Workflow Notes

Active workflow:

```text
.github/workflows/dashboard-validation.yml
```

Primary validation command:

```bash
python tools/validate_dashboard_fixture_suite.py
```

The workflow is intentionally small:

- checkout repository,
- set up Python,
- run dashboard fixture suite.

No dependencies are installed. This keeps the trust guard fast and simple.

## When it runs

The workflow runs on dashboard, fixture, validator, command, and v0.6 validation-doc changes.

## Failure meaning

A failure means one of the following happened:

- positive fixture no longer passes,
- negative fixture no longer fails,
- negative fixture fails for the wrong reason,
- warning fixture became a hard failure,
- warning fixture stopped warning.

## Boundary

CI checks dashboard payload integrity. It does not validate the scientific truth of evidence anchors or quantum performance claims.
