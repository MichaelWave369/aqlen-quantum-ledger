#!/usr/bin/env python3
"""
AQLEN Readiness Scorer v0.1

Usage:
  python tools/readiness_scorer.py data/readiness_score.example.json

This helper calculates a bounded readiness estimate from supplied axis scores.
It does not prove fault tolerance.
"""

import json
import sys
from pathlib import Path

DEFAULT_WEIGHTS = {
    "control_fidelity_score": 0.18,
    "spam_readout_score": 0.12,
    "coherence_stability_score": 0.12,
    "error_provenance_score": 0.14,
    "calibration_repeatability_score": 0.12,
    "yield_variation_score": 0.10,
    "connectivity_score": 0.08,
    "thermal_control_scalability_score": 0.08,
    "evidence_maturity_score": 0.06,
}

BANDS = [
    (0.39, "exploratory"),
    (0.59, "promising lab evidence"),
    (0.74, "prototype-ready evidence"),
    (0.89, "correction-relevant engineering lane"),
    (1.00, "strong candidate for targeted correction integration"),
]


def band_for(score: float) -> str:
    for limit, label in BANDS:
        if score <= limit:
            return label
    return "out-of-range"


def score(axis_scores, weights=None):
    weights = weights or DEFAULT_WEIGHTS
    missing = [key for key in weights if key not in axis_scores]
    if missing:
        raise ValueError(f"Missing axis scores: {missing}")
    bad = {
        key: value
        for key, value in axis_scores.items()
        if not isinstance(value, (int, float)) or not 0 <= value <= 1
    }
    if bad:
        raise ValueError(f"Axis scores must be numeric values between 0 and 1: {bad}")
    return round(sum(axis_scores[key] * weights[key] for key in weights), 3)


def main(path):
    data = json.loads(Path(path).read_text())
    weights = data.get("weights") or DEFAULT_WEIGHTS
    computed = score(data["axis_scores"], weights)
    data["weighted_score"] = computed
    data["readiness_band"] = band_for(computed)
    print(json.dumps(data, indent=2))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        raise SystemExit(2)
    main(sys.argv[1])
