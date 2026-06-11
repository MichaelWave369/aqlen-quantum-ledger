#!/usr/bin/env python3
"""Summarize an AQLEN receipt graph JSON file.

This helper is intentionally small and dependency-free. It is for local
inspection of graph exports, not for making scientific claims.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any


def load_graph(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        graph = json.load(handle)
    if not isinstance(graph, dict):
        raise ValueError("Graph file must contain a JSON object.")
    return graph


def summarize(graph: dict[str, Any]) -> str:
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    node_counts = Counter(node.get("type", "unknown") for node in nodes)
    edge_counts = Counter(edge.get("type", "unknown") for edge in edges)

    incoming: dict[str, int] = defaultdict(int)
    outgoing: dict[str, int] = defaultdict(int)
    labels = {node.get("id"): node.get("label", node.get("id")) for node in nodes}

    for edge in edges:
        source = edge.get("from")
        target = edge.get("to")
        if source:
            outgoing[source] += 1
        if target:
            incoming[target] += 1

    lines = [
        f"Graph: {graph.get('graph_id', 'unknown')}",
        f"Version: {graph.get('version', 'unknown')}",
        f"Summary: {graph.get('summary', '')}",
        "",
        "Node counts:",
    ]

    for node_type, count in sorted(node_counts.items()):
        lines.append(f"- {node_type}: {count}")

    lines.append("")
    lines.append("Edge counts:")
    for edge_type, count in sorted(edge_counts.items()):
        lines.append(f"- {edge_type}: {count}")

    lines.append("")
    lines.append("Most connected nodes:")
    total_degree = Counter()
    for node_id in labels:
        total_degree[node_id] = incoming[node_id] + outgoing[node_id]

    for node_id, degree in total_degree.most_common(5):
        lines.append(f"- {labels[node_id]} ({node_id}): {degree}")

    return "\n".join(lines)


def main() -> int:
    parser = argparse.ArgumentParser(description="Summarize an AQLEN receipt graph JSON file.")
    parser.add_argument("graph_path", type=Path, help="Path to a receipt graph JSON file")
    args = parser.parse_args()

    graph = load_graph(args.graph_path)
    print(summarize(graph))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
