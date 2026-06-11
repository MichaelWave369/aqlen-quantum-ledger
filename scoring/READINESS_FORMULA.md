# Readiness Formula v0.1

The AQLEN readiness score is a bounded, context-specific estimate.

## Inputs

Each axis is scored from 0.0 to 1.0.

- control_fidelity_score
- spam_readout_score
- coherence_stability_score
- error_provenance_score
- calibration_repeatability_score
- yield_variation_score
- connectivity_score
- thermal_control_scalability_score
- evidence_maturity_score

## Default weights

```json
{
  "control_fidelity_score": 0.18,
  "spam_readout_score": 0.12,
  "coherence_stability_score": 0.12,
  "error_provenance_score": 0.14,
  "calibration_repeatability_score": 0.12,
  "yield_variation_score": 0.10,
  "connectivity_score": 0.08,
  "thermal_control_scalability_score": 0.08,
  "evidence_maturity_score": 0.06
}
```

## Formula

```text
readiness = sum(axis_score x axis_weight)
```

## Bands

- 0.00-0.39: exploratory
- 0.40-0.59: promising lab evidence
- 0.60-0.74: prototype-ready evidence
- 0.75-0.89: correction-relevant engineering lane
- 0.90-1.00: strong candidate for targeted correction integration

## Boundary

This score does not prove fault tolerance. It only indicates how ready a platform, device, or control stack appears for a chosen target under available evidence.
