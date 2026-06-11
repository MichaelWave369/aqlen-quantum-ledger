#!/usr/bin/env python3
"""Validate AQLEN dashboard payloads.

This validator is intentionally lightweight and dependency-free. It checks that
renderer payloads preserve the minimum evidence/claim-boundary structure needed
for local dashboard inspection.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set

REQUIRED_TOP_LEVEL = {
    "dashboard_payload_version",
    "graph_id",
    "graph_version",
    "nodes",
    "edges",
    "summary_cards",
    "boundary_cards",
    "focus_trace",
    "global_claim_boundary",
}

REQUIRED_NODE_FIELDS = {"id", "type", "label", "group", "status"}
REQUIRED_EDGE_FIELDS = {"id", "source", "target", "type", "label"}
ALLOWED_TRACE_DIRECTIONS = {"upstream", "downstream"}


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, dict):
        raise ValueError("payload root must be an object")
    return data


def _is_nonempty_string(value: Any) -> bool:
    return isinstance(value, str) and bool(value.strip())


def validate_payload(payload: Dict[str, Any]) -> Dict[str, Any]:
    errors: List[str] = []
    warnings: List[str] = []

    missing_top = sorted(REQUIRED_TOP_LEVEL - set(payload.keys()))
    for key in missing_top:
        errors.append(f"missing top-level key: {key}")

    nodes = payload.get("nodes", [])
    edges = payload.get("edges", [])
    boundary_cards = payload.get("boundary_cards", [])
    focus_trace = payload.get("focus_trace", {})
    summary_cards = payload.get("summary_cards", {})

    if not isinstance(nodes, list):
        errors.append("nodes must be a list")
        nodes = []
    if not isinstance(edges, list):
        errors.append("edges must be a list")
        edges = []
    if not isinstance(boundary_cards, list):
        errors.append("boundary_cards must be a list")
        boundary_cards = []
    if not isinstance(focus_trace, dict):
        errors.append("focus_trace must be an object")
        focus_trace = {}
    if not isinstance(summary_cards, dict):
        errors.append("summary_cards must be an object")
        summary_cards = {}

    node_ids: Set[str] = set()
    duplicate_node_ids: Set[str] = set()
    node_by_id: Dict[str, Dict[str, Any]] = {}

    for index, node in enumerate(nodes):
        if not isinstance(node, dict):
            errors.append(f"node[{index}] must be an object")
            continue
        missing = sorted(REQUIRED_NODE_FIELDS - set(node.keys()))
        for field in missing:
            errors.append(f"node[{index}] missing field: {field}")
        node_id = node.get("id")
        if not _is_nonempty_string(node_id):
            errors.append(f"node[{index}] id must be a non-empty string")
            continue
        if node_id in node_ids:
            duplicate_node_ids.add(node_id)
        node_ids.add(node_id)
        node_by_id[node_id] = node

        if not _is_nonempty_string(node.get("status")):
            warnings.append(f"node {node_id} missing useful status")
        if node.get("claim_boundary") and not node.get("warnings"):
            warnings.append(f"node {node_id} has claim_boundary but no warning card text")

    for node_id in sorted(duplicate_node_ids):
        errors.append(f"duplicate node id: {node_id}")

    edge_ids: Set[str] = set()
    duplicate_edge_ids: Set[str] = set()

    for index, edge in enumerate(edges):
        if not isinstance(edge, dict):
            errors.append(f"edge[{index}] must be an object")
            continue
        missing = sorted(REQUIRED_EDGE_FIELDS - set(edge.keys()))
        for field in missing:
            errors.append(f"edge[{index}] missing field: {field}")
        edge_id = edge.get("id")
        if not _is_nonempty_string(edge_id):
            errors.append(f"edge[{index}] id must be a non-empty string")
            continue
        if edge_id in edge_ids:
            duplicate_edge_ids.add(edge_id)
        edge_ids.add(edge_id)

        source = edge.get("source")
        target = edge.get("target")
        if source not in node_ids:
            errors.append(f"edge {edge_id} source not found: {source}")
        if target not in node_ids:
            errors.append(f"edge {edge_id} target not found: {target}")
        if not _is_nonempty_string(edge.get("label")):
            warnings.append(f"edge {edge_id} missing useful label")

    for edge_id in sorted(duplicate_edge_ids):
        errors.append(f"duplicate edge id: {edge_id}")

    for index, card in enumerate(boundary_cards):
        if not isinstance(card, dict):
            errors.append(f"boundary_cards[{index}] must be an object")
            continue
        node_id = card.get("node_id")
        if node_id not in node_ids:
            errors.append(f"boundary card references missing node: {node_id}")
        if not _is_nonempty_string(card.get("boundary")):
            warnings.append(f"boundary card for {node_id} has empty boundary text")

    if not _is_nonempty_string(payload.get("global_claim_boundary")):
        errors.append("global_claim_boundary must be present and non-empty")

    focus_id = focus_trace.get("focus_id")
    if focus_id and focus_id not in node_ids:
        errors.append(f"focus_trace focus_id not found: {focus_id}")

    for direction in ALLOWED_TRACE_DIRECTIONS:
        trace_items = focus_trace.get(direction, [])
        if not isinstance(trace_items, list):
            errors.append(f"focus_trace.{direction} must be a list")
            continue
        for index, item in enumerate(trace_items):
            if not isinstance(item, dict):
                errors.append(f"focus_trace.{direction}[{index}] must be an object")
                continue
            node_id = item.get("node_id")
            edge_id = item.get("via_edge_id")
            if node_id not in node_ids:
                errors.append(f"focus_trace.{direction}[{index}] node not found: {node_id}")
            if edge_id and edge_id not in edge_ids:
                errors.append(f"focus_trace.{direction}[{index}] edge not found: {edge_id}")

    if summary_cards:
        expected_nodes = len(nodes)
        expected_edges = len(edges)
        if summary_cards.get("node_count") != expected_nodes:
            warnings.append(
                f"summary_cards.node_count is {summary_cards.get('node_count')} but actual is {expected_nodes}"
            )
        if summary_cards.get("edge_count") != expected_edges:
            warnings.append(
                f"summary_cards.edge_count is {summary_cards.get('edge_count')} but actual is {expected_edges}"
            )

    return {
        "ok": not errors,
        "error_count": len(errors),
        "warning_count": len(warnings),
        "errors": errors,
        "warnings": warnings,
        "counts": {
            "nodes": len(nodes),
            "edges": len(edges),
            "boundary_cards": len(boundary_cards),
        },
    }


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate AQLEN dashboard payload JSON files.")
    parser.add_argument("payloads", nargs="+", help="Dashboard payload JSON files to validate")
    parser.add_argument("--json", action="store_true", help="Emit machine-readable JSON report")
    args = parser.parse_args(argv)

    reports: Dict[str, Any] = {}
    overall_ok = True

    for item in args.payloads:
        path = Path(item)
        try:
            payload = load_json(path)
            report = validate_payload(payload)
        except Exception as exc:  # pragma: no cover - defensive CLI behavior
            report = {
                "ok": False,
                "error_count": 1,
                "warning_count": 0,
                "errors": [str(exc)],
                "warnings": [],
                "counts": {},
            }
        reports[str(path)] = report
        overall_ok = overall_ok and bool(report.get("ok"))

    if args.json:
        print(json.dumps({"ok": overall_ok, "reports": reports}, indent=2, sort_keys=True))
    else:
        for path, report in reports.items():
            status = "PASS" if report.get("ok") else "FAIL"
            print(f"{status} {path}")
            for error in report.get("errors", []):
                print(f"  ERROR: {error}")
            for warning in report.get("warnings", []):
                print(f"  WARN: {warning}")

    return 0 if overall_ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
