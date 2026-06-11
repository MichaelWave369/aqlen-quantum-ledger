# Renderer Next Pass v0.2

Status: planned  
Depends on: Dashboard Renderer v0.1

## Goal

Move from a readable card-based renderer to a true receipt-graph exploration surface.

## Required capabilities

1. Click any node to make it the focus node.
2. Highlight upstream and downstream trace paths.
3. Search by node id, label, type, status, and warning text.
4. Filter by node group.
5. Show a source-status legend.
6. Export the current focused trace as JSON.
7. Preserve global claim-boundary and boundary cards at all times.
8. Add fixture payloads for at least three focus modes:
   - readiness score focus
   - evidence anchor focus
   - noise event focus

## Acceptance criteria

- Opening `dashboard/receipt_graph_renderer.html` from a local server displays the demo payload.
- Boundary cards remain visible after focus changes.
- Focus changes never remove claim-boundary context.
- Edge notes remain visible in the focused trace.
- The renderer does not require external network access.

## Future app direction

The static renderer can later become a React/Vite dashboard. For now, the static renderer keeps AQLEN lightweight, inspectable, and easy to run from the private repo.
