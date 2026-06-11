# Issue Draft: Build interactive renderer v0.2

## Summary

Upgrade the static card renderer into an interactive receipt graph viewer.

## Current state

Dashboard Renderer v0.1 can render a dashboard export payload with summary cards, node cards, edge cards, boundary cards, and a focus trace.

## Next work

- Add click-to-focus node behavior.
- Add node search.
- Add group filters.
- Add source-status legend.
- Add export focused trace button.
- Add fixture payloads for readiness-score, evidence-anchor, and noise-event focus modes.
- Keep boundary cards and global claim boundary visible after every interaction.

## Acceptance criteria

- User can click any node and see its local trace highlighted.
- User can filter nodes without losing claim-boundary context.
- User can export the focused trace as JSON.
- No external network service is required.
- The renderer continues to frame AQLEN as a research-intelligence architecture, not a claim of deployed fault-tolerant quantum computing.
