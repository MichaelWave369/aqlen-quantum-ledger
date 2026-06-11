# AQLEN Graph Renderer v0.7 Targets

Status: planned  
Depends on: v0.6 validation fixture suite and dashboard validation workflow

## Objective

v0.7 should harden dashboard validation beyond fixture pass/fail and move toward release-candidate discipline.

## Target areas

1. Schema alignment
   - Align dashboard payload validation with a formal JSON schema.
   - Keep the dependency-free validator as a fast local check.
   - Add schema-level docs for fields, optional metadata, warnings, and claim-boundary cards.

2. Renderer smoke artifacts
   - Add static sample payloads for each focus mode.
   - Add expected validation reports for positive, negative, and warning fixtures.
   - Consider storing generated `--json` outputs as reviewable artifacts.

3. CI hardening
   - Run the fixture suite on every dashboard, validator, and fixture change.
   - Add a separate job for docs/command consistency if needed.
   - Keep CI dependency-free unless there is a clear reason to add a package.

4. Claim-boundary preservation
   - Add checks that global claim boundary exists.
   - Add checks that node-level claim boundaries remain visible as warnings or boundary cards.
   - Add checks that evidence/source/status metadata is not silently dropped.

5. Operator usability
   - Make fixture failures easy to read.
   - Keep machine-readable JSON output for future dashboard/CI integrations.
   - Add a short triage guide: broken link, duplicate node, missing boundary, drift warning.

## Exit criteria

v0.7 is ready when a new contributor can run one command and clearly see whether the dashboard payloads preserve traceability and claim-boundary integrity.

```bash
python tools/validate_dashboard_fixture_suite.py
```

## Boundary

This validation layer checks the structure and auditability of dashboard payloads. It does not validate the truth of external scientific claims or guarantee quantum-system performance.
