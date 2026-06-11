# Dashboard Validation v0.6 Status

Status: implemented prototype

## Added

- Fixture suite runner
- Positive fixture checks
- Negative fixture checks
- Warning fixture checks
- CI workflow
- CI command documentation
- Triage guide
- v0.7 targets

## Key command

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Why this matters

AQLEN's dashboard is not only a visualization layer. It is also an operator-facing trust surface. If a payload drops a claim boundary, breaks an evidence edge, duplicates a node, or corrupts a focus trace, the dashboard could mislead an operator even if the page still renders.

v0.6 makes those failure modes explicit.

## Fixture categories

### Positive

Known-good payloads should pass.

### Negative

Intentionally broken payloads should fail for expected reasons.

### Warning

Payloads with non-fatal drift should pass but surface warnings.

## Boundary

Validation means the dashboard payload is structurally inspectable. It does not mean that the scientific claims represented by the payload are true.
