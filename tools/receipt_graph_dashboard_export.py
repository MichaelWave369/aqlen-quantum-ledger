#!/usr/bin/env python3
"""Export an AQLEN receipt graph into a dashboard-ready JSON payload.

The exporter keeps claim boundaries visible in the payload so a UI can show
what the graph supports and what it does not support.
"""

from __future__ import annotations

import argparse
import json
from collections import Counter, defaultdict, deque
from pathlib import Path
from typing import Any, Dict, Iterable, List, Set


NODE_BADGES = {
    "evidence_anchor": "Evidence",
    "qubit_receipt": "Qubit",
    "noise_event": "Noise",
    "calibration_receipt": "Calibration",
    "readiness_score": "Readiness",
    "module": "Module",
}

NODE_GROUPS = {
    "evidence_anchor": "evidence",
    "qubit_receipt": "device",
    "noise_event": "error",
    "calibration_receipt": "calibration",
    "readiness_score": "score",
    "module": "architecture",
}

DEFAULT_BOUNDARY = (
    "AQLEN is a research and intelligence architecture for tracking evidence, "
    "errors, calibration, and readiness. It is not a claim that practical "
    "fault-tolerant quantum computing has been solved."
)


def load_graph(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        graph = json.load(handle)
    if "nodes" not in graph or "edges" not in graph:
        raise ValueError("Graph must contain top-level 'nodes' and 'edges' arrays.")
    return graph


def index_edges(edges: Iterable[Dict[str, Any]]) -> tuple[Dict[str, List[Dict[str, Any]]], Dict[str, List[Dict[str, Any]]]]:
    outgoing: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    incoming: Dict[str, List[Dict[str, Any]]] = defaultdict(list)
    for edge in edges:
        source = edge.get("from")
        target = edge.get("to")
        if not source or not target:
            continue
        outgoing[source].append(edge)
        incoming[target].append(edge)
    return outgoing, incoming


def walk(start: str, edge_index: Dict[str, List[Dict[str, Any]]], direction: str, depth: int) -> List[Dict[str, Any]]:
    """Breadth-first traversal returning ordered reachable node ids and edge ids."""
    seen: Set[str] = {start}
    results: List[Dict[str, Any]] = []
    queue = deque([(start, 0)])

    while queue:
        current, level = queue.popleft()
        if level >= depth:
            continue
        for edge in edge_index.get(current, []):
            source = edge.get("from")
            target = edge.get("to")
            next_node = target if direction == "downstream" else source
            if not next_node or next_node in seen:
                continue
            seen.add(next_node)
            edge_id = f"{source}->{target}:{edge.get('type', 'related')}"
            results.append({"node_id": next_node, "via_edge_id": edge_id, "depth": level + 1})
            queue.append((next_node, level + 1))
    return results


def make_dashboard_nodes(nodes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    dashboard_nodes = []
    for node in nodes:
        node_type = node.get("type", "unknown")
        claim_boundary = node.get("claim_boundary")
        dashboard_nodes.append(
            {
                "id": node.get("id"),
                "label": node.get("label", node.get("id")),
                "type": node_type,
                "status": node.get("status", "unknown"),
                "badge": NODE_BADGES.get(node_type, "Node"),
                "group": NODE_GROUPS.get(node_type, "other"),
                "claim_boundary": claim_boundary,
                "warnings": [claim_boundary] if claim_boundary else [],
            }
        )
    return dashboard_nodes


def make_dashboard_edges(edges: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    dashboard_edges = []
    for edge in edges:
        source = edge.get("from")
        target = edge.get("to")
        edge_type = edge.get("type", "related")
        dashboard_edges.append(
            {
                "id": f"{source}->{target}:{edge_type}",
                "source": source,
                "target": target,
                "type": edge_type,
                "label": edge_type.replace("_", " "),
                "note": edge.get("note"),
                "weight": edge.get("weight"),
            }
        )
    return dashboard_edges


def build_export(graph: Dict[str, Any], focus_id: str | None, depth: int) -> Dict[str, Any]:
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    node_ids = {node.get("id") for node in nodes}
    outgoing, incoming = index_edges(edges)

    if focus_id and focus_id not in node_ids:
        raise ValueError(f"Focus node not found in graph: {focus_id}")

    type_counts = Counter(node.get("type", "unknown") for node in nodes)
    boundary_nodes = [node for node in nodes if node.get("claim_boundary")]

    focus_panel = None
    if focus_id:
        focus_panel = {
            "focus_id": focus_id,
            "upstream": walk(focus_id, incoming, "upstream", depth),
            "downstream": walk(focus_id, outgoing, "downstream", depth),
        }

    return {
        "dashboard_payload_version": "v0.1",
        "graph_id": graph.get("graph_id"),
        "graph_version": graph.get("version"),
        "summary": graph.get("summary"),
        "global_claim_boundary": DEFAULT_BOUNDARY,
        "summary_cards": {
            "node_count": len(nodes),
            "edge_count": len(edges),
            "node_types": dict(sorted(type_counts.items())),
            "boundary_node_count": len(boundary_nodes),
        },
        "nodes": make_dashboard_nodes(nodes),
        "edges": make_dashboard_edges(edges),
        "focus_trace": focus_panel,
        "boundary_cards": [
            {
                "node_id": node.get("id"),
                "label": node.get("label", node.get("id")),
                "boundary": node.get("claim_boundary"),
            }
            for node in boundary_nodes
        ],
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Export AQLEN receipt graph data for dashboard prototypes.")
    parser.add_argument("export", choices=["export"], help="Export dashboard-ready JSON.")
    parser.add_argument("--graph", required=True, type=Path, help="Path to receipt graph JSON.")
    parser.add_argument("--out", type=Path, help="Optional output JSON path. Prints to stdout if omitted.")
    parser.add_argument("--focus", help="Optional node id to build upstream/downstream focus trace around.")
    parser.add_argument("--depth", type=int, default=4, help="Traversal depth for focus traces. Default: 4.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    graph = load_graph(args.graph)
    payload = build_export(graph, args.focus, args.depth)
    text = json.dumps(payload, indent=2, sort_keys=True)
    if args.out:
        args.out.parent.mkdir(parents=True, exist_ok=True)
        args.out.write_text(text + "\n", encoding="utf-8")
    else:
        print(text)


if __name__ == "__main__":
    main()
