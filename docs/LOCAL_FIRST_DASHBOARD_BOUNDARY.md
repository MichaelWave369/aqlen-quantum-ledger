# Local-First Dashboard Boundary

AQLEN dashboard work should remain local-first until there is a clear reason to add hosted infrastructure.

## Why

The dashboard displays research evidence, experimental receipts, calibration notes, readiness scores, and claim boundaries. These should stay inspectable without requiring a cloud service.

## Current posture

The v0.1 renderer:

- Runs from a static HTML file.
- Loads a local JSON export when served from repo root.
- Allows manual JSON upload or paste.
- Does not send data to an external service.
- Keeps the global claim boundary visible.

## Future hosted posture

A hosted dashboard can be considered later only after:

1. Data sensitivity rules are defined.
2. Source-rights and citation policy are clear.
3. User/project permissions are defined.
4. Claim-boundary panels are mandatory.
5. Export and audit logs are implemented.

## Boundary phrase

AQLEN is a research-intelligence architecture for tracking evidence, errors, calibration, and readiness. It is not a claim that practical fault-tolerant quantum computing has been solved.
