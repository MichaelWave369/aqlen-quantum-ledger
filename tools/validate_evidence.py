#!/usr/bin/env python3
"""
AQLEN evidence validator v0.1

Usage:
  python tools/validate_evidence.py data/evidence_anchors.json

This performs lightweight structural checks without external dependencies.
"""

import json
import sys
from pathlib import Path

REQUIRED_FIELDS = {
    "anchor_id",
    "title",
    "source_type",
    "publication_year",
    "platform",
    "claims",
    "claim_boundary",
    "confidence",
}

VALID_CONFIDENCE = {"low", "medium", "high", "very_high"}
VALID_SOURCE_TYPES = {
    "peer_reviewed_paper",
    "preprint",
    "institutional_release",
    "review",
    "secondary_article",
}


def validate_anchor(anchor: dict) -> list[str]:
    errors = []
    missing = sorted(REQUIRED_FIELDS - set(anchor))
    if missing:
        errors.append(f"{anchor.get('anchor_id', '<missing id>')}: missing fields {missing}")
    if anchor.get("confidence") not in VALID_CONFIDENCE:
        errors.append(f"{anchor.get('anchor_id', '<missing id>')}: invalid confidence")
    if anchor.get("source_type") not in VALID_SOURCE_TYPES:
        errors.append(f"{anchor.get('anchor_id', '<missing id>')}: invalid source_type")
    if not isinstance(anchor.get("claims"), list) or not anchor.get("claims"):
        errors.append(f"{anchor.get('anchor_id', '<missing id>')}: claims must be a non-empty list")
    return errors


def validate_registry(path: Path) -> list[str]:
    data = json.loads(path.read_text())
    if not isinstance(data, list):
        return ["registry root must be a list"]
    errors = []
    seen = set()
    for anchor in data:
        anchor_id = anchor.get("anchor_id")
        if anchor_id in seen:
            errors.append(f"duplicate anchor_id {anchor_id}")
        seen.add(anchor_id)
        errors.extend(validate_anchor(anchor))
    return errors


def main(path_str: str) -> int:
    errors = validate_registry(Path(path_str))
    if errors:
        print("AQLEN evidence validation failed:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("AQLEN evidence validation passed.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        raise SystemExit(2)
    raise SystemExit(main(sys.argv[1]))
