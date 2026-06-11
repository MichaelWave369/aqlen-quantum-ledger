# AQLEN Receipt Graph Explorer v0.1

## Purpose

The receipt graph explorer is the first query layer for the AQLEN ledger. It turns a static graph of research anchors, qubit receipts, noise events, calibration receipts, and readiness scores into an inspectable system.

The goal is simple:

> AQLEN should not only record results. It should show where each result came from.

## Supported graph question types

### 1. Summary

Shows graph size, node-type counts, edge count, and isolated nodes.

```bash
python tools/receipt_graph_explorer.py summary --graph examples/receipt_graph_minimal.json
```

### 2. Neighbors

Shows immediate incoming and outgoing links for one node.

```bash
python tools/receipt_graph_explorer.py neighbors score.demo.qec_readiness --graph examples/receipt_graph_minimal.json
```

### 3. Upstream trace

Walks backward from a node to show what evidence, receipts, and events contributed to it.

```bash
python tools/receipt_graph_explorer.py upstream score.demo.qec_readiness --graph examples/receipt_graph_minimal.json --depth 6
```

### 4. Downstream trace

Walks forward from a node to show what later receipts, assessments, or decisions depend on it.

```bash
python tools/receipt_graph_explorer.py downstream evidence.unsw.morello.2024 --graph examples/receipt_graph_minimal.json --depth 6
```

### 5. Score trace

Creates a focused readiness-score trace that separates supporting evidence, qubit receipts, noise events, and calibration receipts.

```bash
python tools/receipt_graph_explorer.py score-trace score.demo.qec_readiness --graph examples/receipt_graph_minimal.json --depth 6
```

## Node types

The prototype expects these node classes:

- `evidence_anchor`
- `qubit_receipt` or `qubit_provenance_receipt`
- `noise_event`
- `calibration_receipt`
- `readiness_score`

The helper is intentionally tolerant of early schema drift. It accepts edge keys written as `source` / `target`, `from` / `to`, or `from_id` / `to_id`.

## Claim boundary

The explorer must not turn a readiness score into a claim that practical quantum computing has been solved.

Every score trace should preserve this boundary:

> Readiness scores are traceable research-assessment artifacts, not proof of fault-tolerant quantum deployment.

## v0.2 build target

The next layer should add:

1. JSON schema validation before graph queries.
2. Dashboard export payloads.
3. Human-readable Markdown trace reports.
4. Source-status metadata on every evidence path.
5. Claim-boundary badges for dashboard display.
