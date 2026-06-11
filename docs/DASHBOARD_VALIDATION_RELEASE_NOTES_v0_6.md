# Dashboard Validation Release Notes v0.6

AQLEN dashboard validation v0.6 adds the first CI-ready trust guard for renderer payloads.

## Highlights

- Added fixture-suite runner.
- Added negative fixtures for broken trust paths.
- Added warning fixture for non-fatal summary drift.
- Added dashboard validation GitHub Actions workflow.
- Added triage guide for validator failures.
- Added v0.7 schema-alignment target.

## Main command

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Negative fixtures added

- Missing global claim boundary
- Broken edge source/target
- Duplicate node ID
- Boundary card references missing node
- Focus trace references missing node

## Warning fixture added

- Summary count drift

## Next

v0.7 should add formal dashboard payload schema alignment and generated validation report artifacts.
