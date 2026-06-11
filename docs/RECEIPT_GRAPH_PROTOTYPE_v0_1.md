# AQLEN Receipt Graph Prototype v0.1

AQLEN is moving from separate receipts into a connected ledger graph.

The receipt graph links evidence, device lineage, error events, calibration actions, and readiness scores into one audit-friendly structure.

> AQLEN does not only correct errors. It remembers where the errors came from.

## Purpose

The receipt graph answers five practical questions:

1. Which research anchors support this architecture claim?
2. Which qubit or device did this measurement come from?
3. Which error mechanism was observed?
4. Which calibration action responded to it?
5. How did the final readiness score change, and why?

## Node Types

| Node type | Meaning |
| --- | --- |
| `evidence_anchor` | Research source or validated claim note. |
| `qubit_receipt` | Device, wafer, qubit, or unit-cell provenance record. |
| `noise_event` | Observed error, noise, drift, or instability. |
| `calibration_receipt` | Human-reviewed calibration action and measured effect. |
| `readiness_score` | Computed QEC/platform readiness assessment. |
| `module` | AQLEN architecture module responsible for interpreting the data. |

## Edge Types

| Edge type | Meaning |
| --- | --- |
| `supports` | Evidence supports a claim, model, module, or score input. |
| `measured_on` | Event or score was measured on a device/qubit receipt. |
| `observed_after` | Error event appeared after an operation or calibration. |
| `mitigated_by` | Calibration action reduced or addressed an error. |
| `updates` | New receipt updates a score, model, or timeline. |
| `feeds_module` | Receipt feeds a specific AQLEN architecture module. |
| `derived_from` | Score or insight was derived from one or more receipts. |

## Minimal Graph Loop

```text
evidence_anchor -> qubit_receipt -> noise_event -> calibration_receipt -> readiness_score
        |                |              |                    |                    |
        v                v              v                    v                    v
   claim bounds     provenance     error origin       drift response       QEC readiness
```

## Public Claim Boundary

This prototype is not a claim that practical quantum computing is solved. It is a research and intelligence structure for tracking the error stack.

AQLEN v0.1 tracked receipts independently. AQLEN v0.2 connects them.
