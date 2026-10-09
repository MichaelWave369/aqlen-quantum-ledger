# AQLEN Quantum Ledger

Adaptive Quantum Ledger Evolution Network (AQLEN Ω) is an evidence-aware ledger scaffold for manufacturable quantum systems, starting with silicon spin qubits.

> Manufacturable quantum computing will be won by whoever can ledger the error stack.

AQLEN tracks the chain from material and device provenance through noise origins, calibration drift, correction attempts, and QEC readiness.

```text
material → device → qubit → control → noise → calibration → correction → logical reliability
```

## Core thesis

> AQLEN does not only correct errors. It remembers where the errors came from.

## What this repo is

This public repository contains a research scaffold for a hardware-to-error-to-calibration ledger:

- Evidence anchors for silicon spin qubit manufacturability, cryogenic wafer probing, error-origin analysis, above-1K operation, silicon QEC demos, cryo-CMOS control, and atom-processor milestones.
- JSON schemas for receipts and events used by the AQLEN ledger.
- Example receipts for qubit provenance, noise-origin classification, calibration drift, and QEC readiness scoring.
- A bounded QEC readiness scoring helper.
- Claim boundaries that keep the project grounded and public-safe.
- v0.2 architecture notes for the 10-layer AQLEN Ω intelligence stack.

## What this repo is not

AQLEN does **not** claim that practical fault-tolerant quantum computers are solved.

It does **not** claim to build or operate quantum hardware.

It does **not** treat one fidelity number as proof of system-level readiness.

It does **not** present AI-assisted calibration search as autonomous science without human review.

AQLEN is a research/product architecture for organizing evidence, measurements, claims, errors, calibration actions, and readiness scores.

## v0.2 10-layer architecture

| Layer | Module |
|---:|---|
| 1 | Qubit Provenance Registry |
| 2 | Temporal Error Memory |
| 3 | Predictive Calibration Engine |
| 4 | Quantum Digital Twin Layer |
| 5 | Manufacturing Intelligence Mesh |
| 6 | Quantum Knowledge Graph |
| 7 | AI-Assisted Calibration Search |
| 8 | Federated Research Grid |
| 9 | Human-Reviewed Design Explorer |
| 10 | Living Quantum Ledger |

See `docs/V0_2_10_LAYER_ARCHITECTURE.md` and `registries/module_registry_v0_2.json`.

## Repository layout

```text
docs/         Master spec, claim boundaries, v0.2 architecture, poster truth-pass
registries/   Evidence anchors, module registries, and source registry data
schemas/      JSON schemas for AQLEN receipts/events/scores/modules
examples/     Example ledger objects
tools/        Small utilities, including QEC readiness scoring
scoring/      Formula notes and scoring documentation
assets/       Poster workflow notes and future generated assets
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

Safe product framing:

> AQLEN Ω is a proposed ledger and intelligence layer for manufacturable quantum systems. It records the chain from hardware provenance to error origin, calibration action, and readiness assessment so teams can learn from every qubit, every error, and every correction.

Unsafe framing:

> Silicon quantum computers are solved or ready for mass production.

See `docs/CLAIM_BOUNDARY_MATRIX.md` and `docs/POSTER_TRUTH_PASS_AQLEN_OMEGA.md` for boundary language.

## Version

Initial scaffold: `v0.1`

Current build direction: `v0.2` architecture registry + dashboard data model + poster truth-pass.

## Live research console (React)

The static [React + Vite console](web/README.md) explores AQLEN's **illustrative** evidence and receipt graph. It supports node inspection, search, filtering and local JSON import, all with visible claim boundaries. Files imported by visitors remain in their own browsers. This demo is not a quantum simulator or a claim of deployed quantum hardware.

**GitHub Pages:** https://michaelwave369.github.io/aqlen-quantum-ledger/ (enable **Settings → Pages → Source: GitHub Actions** after merging).

## License

The project software is MIT-licensed. See [LICENSE](LICENSE). External research, figures and third-party material retain their own applicable licensing and attribution.
