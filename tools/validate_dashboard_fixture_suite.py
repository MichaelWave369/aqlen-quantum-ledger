#!/usr/bin/env python3
"""Run positive and negative AQLEN dashboard payload fixture checks.

This suite proves the dashboard payload validator does two things:
1. Accepts known-good renderer payloads.
2. Rejects intentionally broken payloads with specific trust-boundary errors.

It is dependency-free so it can run locally or in CI without installing packages.
"""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Iterable, List

ROOT = Path(__file__).resolve().parents[1]
TOOLS = ROOT / "tools"
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))

from validate_dashboard_payload import load_json, validate_payload  # noqa: E402

SUITE_VERSION = "dashboard_fixture_suite_v0_7"
SCHEMA_REF = "schemas/dashboard_payload.schema.json"

DEFAULT_POSITIVE_FIXTURES = [
    "dashboard/receipt_graph_dashboard_demo.json",
    "dashboard/fixtures/score_focus_demo.json",
    "dashboard/fixtures/evidence_focus_demo.json",
    "dashboard/fixtures/noise_focus_demo.json",
]

DEFAULT_NEGATIVE_FIXTURES = {
    "dashboard/fixtures/negative_missing_global_boundary.json": [
        "missing top-level key: global_claim_boundary",
        "global_claim_boundary must be present and non-empty",
    ],
    "dashboard/fixtures/negative_broken_edge_link.json": [
        "source not found",
        "target not found",
    ],
    "dashboard/fixtures/negative_duplicate_node_id.json": [
        "duplicate node id",
    ],
    "dashboard/fixtures/negative_boundary_missing_node.json": [
        "boundary card references missing node",
    ],
    "dashboard/fixtures/negative_focus_trace_missing_node.json": [
        "focus_trace upstream",
        "node not found",
    ],
}

DEFAULT_WARNING_FIXTURES = {
    "dashboard/fixtures/warning_summary_count_drift.json": [
        "summary_cards.node_count",
        "summary_cards.edge_count",
    ]
}


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _validate(path: Path) -> Dict[str, Any]:
    payload = load_json(path)
    return validate_payload(payload)


def _contains_all(report_items: List[str], expected: List[str]) -> bool:
    haystack = "\n".join(report_items)
    return all(item in haystack for item in expected)


def _bucket_summary(bucket: Dict[str, Dict[str, Any]]) -> Dict[str, int]:
    total = len(bucket)
    passed = sum(1 for item in bucket.values() if item.get("passed"))
    return {"total": total, "passed": passed, "failed": total - passed}


def _attach_summary(results: Dict[str, Any]) -> None:
    results["summary"] = {
        "positive": _bucket_summary(results["positive"]),
        "negative": _bucket_summary(results["negative"]),
        "warning": _bucket_summary(results["warning"]),
    }
    totals = results["summary"].values()
    results["summary"]["overall"] = {
        "total": sum(item["total"] for item in totals),
        "passed": sum(item["passed"] for item in totals),
        "failed": sum(item["failed"] for item in totals),
    }


def run_suite(root: Path) -> Dict[str, Any]:
    results: Dict[str, Any] = {
        "suite_version": SUITE_VERSION,
        "schema_ref": SCHEMA_REF,
        "generated_at": _utc_now(),
        "root": str(root),
        "ok": True,
        "positive": {},
        "negative": {},
        "warning": {},
    }

    for rel in DEFAULT_POSITIVE_FIXTURES:
        path = root / rel
        report = _validate(path)
        passed = bool(report.get("ok"))
        results["positive"][rel] = {"passed": passed, "report": report}
        results["ok"] = results["ok"] and passed

    for rel, expected_errors in DEFAULT_NEGATIVE_FIXTURES.items():
        path = root / rel
        report = _validate(path)
        failed_as_expected = not report.get("ok") and _contains_all(report.get("errors", []), expected_errors)
        results["negative"][rel] = {
            "passed": failed_as_expected,
            "expected_error_fragments": expected_errors,
            "report": report,
        }
        results["ok"] = results["ok"] and failed_as_expected

    for rel, expected_warnings in DEFAULT_WARNING_FIXTURES.items():
        path = root / rel
        report = _validate(path)
        warned_as_expected = bool(report.get("ok")) and _contains_all(report.get("warnings", []), expected_warnings)
        results["warning"][rel] = {
            "passed": warned_as_expected,
            "expected_warning_fragments": expected_warnings,
            "report": report,
        }
        results["ok"] = results["ok"] and warned_as_expected

    _attach_summary(results)
    return results


def write_report(path: Path, result: Dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(result, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Run AQLEN dashboard validator fixture suite.")
    parser.add_argument("--root", default=str(ROOT), help="Repository root path")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON report")
    parser.add_argument(
        "--report-out",
        help="Optional path where the machine-readable fixture-suite report should be written",
    )
    args = parser.parse_args(argv)

    result = run_suite(Path(args.root).resolve())

    if args.report_out:
        write_report(Path(args.report_out), result)

    if args.json:
        print(json.dumps(result, indent=2, sort_keys=True))
    else:
        status = "PASS" if result["ok"] else "FAIL"
        print(f"{status} dashboard fixture suite")
        print(
            "Summary: "
            f"{result['summary']['overall']['passed']}/"
            f"{result['summary']['overall']['total']} checks passed"
        )
        for lane in ("positive", "negative", "warning"):
            lane_summary = result["summary"][lane]
            print(f"\n[{lane}] {lane_summary['passed']}/{lane_summary['total']} passed")
            for rel, item in result[lane].items():
                marker = "PASS" if item["passed"] else "FAIL"
                print(f"  {marker} {rel}")
                report = item.get("report", {})
                for error in report.get("errors", []):
                    print(f"    ERROR: {error}")
                for warning in report.get("warnings", []):
                    print(f"    WARN: {warning}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
