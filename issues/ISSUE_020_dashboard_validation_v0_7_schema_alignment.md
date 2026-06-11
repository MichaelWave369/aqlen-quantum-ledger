# Issue 020 — Build dashboard validation v0.7 schema alignment and report artifacts

Status: planned

## Summary

v0.6 added positive, negative, and warning fixtures plus a CI workflow. v0.7 should align the dashboard validator with a formal schema and add reviewable validation report artifacts.

## Goals

- Add a formal dashboard payload JSON schema.
- Keep the dependency-free validator as the fast local/CI guard.
- Add expected validation reports for fixture categories.
- Add schema documentation for required fields, optional metadata, status values, warning semantics, and claim-boundary cards.
- Add a small report generator that can write validation reports to disk for review.

## Acceptance criteria

- `python tools/validate_dashboard_fixture_suite.py` still passes.
- A dashboard payload schema exists under `schemas/`.
- Positive, negative, and warning fixture expectations are documented.
- Validation reports can be generated as JSON files.
- Claim-boundary preservation remains a first-class validation concern.

## Boundary

This issue is about payload structure and auditability. It is not a scientific-validation issue and does not certify quantum performance claims.
