# AQLEN Quantum Ledger

Adaptive Quantum Lattice Error Network (AQLEN) is an evidence-aware ledger scaffold for manufacturable quantum systems, starting with silicon spin qubits.

> Manufacturable quantum computing will be won by whoever can ledger the error stack.

AQLEN tracks the chain from material and device provenance through noise origins, calibration drift, correction attempts, and QEC readiness.

```text
material → device → qubit → control → noise → calibration → correction → logical reliability
```

## What this repo is

This repository contains the v0.1 build scaffold for a hardware-to-error-to-calibration ledger:

- Evidence anchors for silicon spin qubit manufacturability, cryogenic wafer probing, error-origin analysis, above-1K operation, silicon QEC demos, cryo-CMOS control, and atom-processor milestones.
- JSON schemas for receipts and events used by the AQLEN ledger.
- Example receipts for qubit provenance, noise-origin classification, calibration drift, and QEC readiness scoring.
- A bounded QEC readiness scoring helper.
- Claim boundaries that keep the project grounded and public-safe.

## What this repo is not

AQLEN does **not** claim that practical fault-tolerant quantum computers are solved.

It does **not** claim to build or operate quantum hardware.

It does **not** treat one fidelity number as proof of system-level readiness.

AQLEN is a research/product architecture for organizing evidence, measurements, claims, errors, calibration actions, and readiness scores.

## Current module map

| Module | Purpose |
|---|---|
| Qubit Provenance Ledger | Track wafer/device/material/manufacturing context for qubit systems. |
| Noise-Origin Classifier | Classify observed error events by likely physical source. |
| Calibration Drift Ledger | Record before/action/after calibration receipts and residual risks. |
| Thermal-Cryo Infrastructure Ledger | Link qubit behavior to cooling, wiring, control electronics, and thermal constraints. |
| QEC Readiness Scorer | Estimate readiness for a specified QEC target under explicit assumptions. |
| Manufacturing Feedback Loop | Turn device measurements into fab/process feedback. |

## Repository layout

```text
docs/         Master spec, claim boundaries, theory notes
registries/   Evidence anchors and source registry data
schemas/      JSON schemas for AQLEN receipts/events/scores
examples/     Example ledger objects
tools/        Small utilities, including QEC readiness scoring
scoring/      Formula notes and scoring documentation
tests/        Validation tests
```

## Quick start

Run the sample scorer:

```bash
python tools/qec_readiness_scorer.py examples/example_qec_readiness_score.json
```

Run tests:

```bash
python -m pytest
```

## Claim posture

Safe framing:

> Silicon spin qubits are entering a manufacturing-led error-ledger era.

Unsafe framing:

> Silicon quantum computers are solved or ready for mass production.

See `docs/CLAIM_BOUNDARY_MATRIX.md` for the full boundary matrix.

## Version

Initial private scaffold: `v0.1`

Next build target: `v0.2` dashboard + evidence intake pipeline.
