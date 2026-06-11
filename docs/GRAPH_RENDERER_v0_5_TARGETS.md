# Graph Renderer v0.5 Target Plan

Status: planned
Depends on: Graph Renderer v0.4

## Why v0.5 exists

v0.4 improved the interface. v0.5 should improve confidence that the interface is rendering ledger payloads correctly.

The next pass should focus on validation, fixtures, and dashboard reliability.

## Target features

1. Fixture payload set
   - readiness-score focus fixture
   - evidence-anchor focus fixture
   - noise/error focus fixture
   - calibration focus fixture
   - broken-edge fixture
   - missing-status fixture

2. Renderer smoke checks
   - load each fixture
   - verify node count
   - verify edge count
   - verify global claim boundary visibility
   - verify selected-node panel updates
   - verify selected-edge panel updates

3. Payload warnings
   - missing node referenced by edge
   - duplicate node ID
   - missing global claim boundary
   - missing source/status metadata
   - edge with no type
   - node with unsupported family/type

4. UI reliability polish
   - visible payload warning panel
   - fixture selector
   - selected edge highlighting from both card and graph path
   - screenshot-ready graph title block
   - dashboard export version badge

5. Claim discipline
   - no renderer path should imply solved quantum computing
   - all readiness-score paths should preserve source/status context
   - unsupported or missing metadata should lower UI confidence, not raise it

## Success condition

AQLEN can load multiple local receipt graph fixtures, render them, warn about bad payload structure, and preserve claim boundaries in every view.
