#!/usr/bin/env python3
"""AQLEN receipt graph explorer.

Small, dependency-free helper for exploring a receipt graph made of nodes and edges.
It supports upstream evidence tracing, downstream impact tracing, direct neighbors,
and a score-trace view for readiness-score nodes.

Expected graph shape:
{
  "nodes": [{"id": "...", "type": "...", "label": "..."}],
  "edges": [{"source": "...", "target": "...", "relation": "..."}]
}

The edge keys may also be written as from/from_id and to/to_id; this helper
normalizes those variants so early prototype files can evolve safely.
"""

from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

Node = Dict[str, Any]
Edge = Dict[str, Any]
Graph = Dict[str, Any]


def load_graph(path: str) -> Graph:
    graph_path = Path(path)
    with graph_path.open("r", encoding="utf-8") as handle:
        graph = json.load(handle)

    if "nodes" not in graph or "edges" not in graph:
        raise ValueError("Graph must contain top-level 'nodes' and 'edges' arrays.")

    return graph


def node_id(node: Node) -> str:
    return str(node.get("id") or node.get("node_id") or "")


def edge_source(edge: Edge) -> str:
    return str(edge.get("source") or edge.get("from") or edge.get("from_id") or "")


def edge_target(edge: Edge) -> str:
    return str(edge.get("target") or edge.get("to") or edge.get("to_id") or "")


def edge_relation(edge: Edge) -> str:
    return str(edge.get("relation") or edge.get("type") or "links_to")


def index_graph(graph: Graph) -> Tuple[Dict[str, Node], Dict[str, List[Edge]], Dict[str, List[Edge]]]:
    nodes = {node_id(node): node for node in graph.get("nodes", []) if node_id(node)}
    outgoing: Dict[str, List[Edge]] = {key: [] for key in nodes}
    incoming: Dict[str, List[Edge]] = {key: [] for key in nodes}

    for edge in graph.get("edges", []):
        source = edge_source(edge)
        target = edge_target(edge)
        if not source or not target:
            continue
        outgoing.setdefault(source, []).append(edge)
        incoming.setdefault(target, []).append(edge)

    return nodes, incoming, outgoing


def format_node(node: Node | None, fallback: str) -> Dict[str, Any]:
    if node is None:
        return {"id": fallback, "missing": True}
    return {
        "id": node_id(node),
        "type": node.get("type"),
        "label": node.get("label") or node.get("title") or node_id(node),
        "status": node.get("status"),
        "claim_boundary": node.get("claim_boundary"),
    }


def direct_neighbors(graph: Graph, start_id: str) -> Dict[str, Any]:
    nodes, incoming, outgoing = index_graph(graph)
    return {
        "query": "neighbors",
        "node": format_node(nodes.get(start_id), start_id),
        "incoming": [
            {
                "relation": edge_relation(edge),
                "from": format_node(nodes.get(edge_source(edge)), edge_source(edge)),
            }
            for edge in incoming.get(start_id, [])
        ],
        "outgoing": [
            {
                "relation": edge_relation(edge),
                "to": format_node(nodes.get(edge_target(edge)), edge_target(edge)),
            }
            for edge in outgoing.get(start_id, [])
        ],
    }


def walk(graph: Graph, start_id: str, direction: str, max_depth: int = 4) -> Dict[str, Any]:
    nodes, incoming, outgoing = index_graph(graph)
    edge_map = incoming if direction == "upstream" else outgoing
    queue: deque[Tuple[str, int, List[Dict[str, Any]]]] = deque([(start_id, 0, [])])
    visited = {start_id}
    paths: List[List[Dict[str, Any]]] = []

    while queue:
        current_id, depth, path = queue.popleft()
        if depth >= max_depth:
            continue

        for edge in edge_map.get(current_id, []):
            next_id = edge_source(edge) if direction == "upstream" else edge_target(edge)
            step = {
                "from": edge_source(edge),
                "relation": edge_relation(edge),
                "to": edge_target(edge),
                "node": format_node(nodes.get(next_id), next_id),
            }
            next_path = path + [step]
            paths.append(next_path)
            if next_id not in visited:
                visited.add(next_id)
                queue.append((next_id, depth + 1, next_path))

    return {
        "query": direction,
        "start": format_node(nodes.get(start_id), start_id),
        "max_depth": max_depth,
        "paths": paths,
    }


def score_trace(graph: Graph, score_id: str, max_depth: int = 6) -> Dict[str, Any]:
    upstream = walk(graph, score_id, "upstream", max_depth=max_depth)
    evidence_nodes = []
    receipt_nodes = []
    calibration_nodes = []
    noise_nodes = []

    for path in upstream["paths"]:
        for step in path:
            node = step["node"]
            node_type = node.get("type")
            if node_type == "evidence_anchor":
                evidence_nodes.append(node)
            elif node_type in {"qubit_receipt", "qubit_provenance_receipt"}:
                receipt_nodes.append(node)
            elif node_type == "calibration_receipt":
                calibration_nodes.append(node)
            elif node_type == "noise_event":
                noise_nodes.append(node)

    def dedupe(items: Iterable[Dict[str, Any]]) -> List[Dict[str, Any]]:
        seen = set()
        output = []
        for item in items:
            item_id = item.get("id")
            if item_id not in seen:
                seen.add(item_id)
                output.append(item)
        return output

    nodes, _, _ = index_graph(graph)
    return {
        "query": "score_trace",
        "score": format_node(nodes.get(score_id), score_id),
        "summary": {
            "evidence_anchor_count": len(dedupe(evidence_nodes)),
            "qubit_receipt_count": len(dedupe(receipt_nodes)),
            "noise_event_count": len(dedupe(noise_nodes)),
            "calibration_receipt_count": len(dedupe(calibration_nodes)),
        },
        "upstream_evidence": dedupe(evidence_nodes),
        "qubit_receipts": dedupe(receipt_nodes),
        "noise_events": dedupe(noise_nodes),
        "calibration_receipts": dedupe(calibration_nodes),
        "full_upstream_paths": upstream["paths"],
        "claim_boundary": "Readiness scores are traceable research-assessment artifacts, not proof of fault-tolerant quantum deployment.",
    }


def graph_summary(graph: Graph) -> Dict[str, Any]:
    nodes, incoming, outgoing = index_graph(graph)
    counts: Dict[str, int] = {}
    for node in nodes.values():
        counts[str(node.get("type") or "unknown")] = counts.get(str(node.get("type") or "unknown"), 0) + 1
    return {
        "query": "summary",
        "node_count": len(nodes),
        "edge_count": len(graph.get("edges", [])),
        "node_type_counts": counts,
        "isolated_nodes": [
            node_id(node)
            for node in nodes.values()
            if not incoming.get(node_id(node)) and not outgoing.get(node_id(node))
        ],
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Explore an AQLEN receipt graph.")
    parser.add_argument("command", choices=["summary", "neighbors", "upstream", "downstream", "score-trace"])
    parser.add_argument("node_id", nargs="?", help="Node id for node-specific commands.")
    parser.add_argument("--graph", default="examples/receipt_graph_minimal.json", help="Path to graph JSON file.")
    parser.add_argument("--depth", type=int, default=4, help="Traversal depth for upstream/downstream commands.")
    args = parser.parse_args()

    graph = load_graph(args.graph)

    if args.command == "summary":
        result = graph_summary(graph)
    else:
        if not args.node_id:
            raise SystemExit(f"{args.command} requires node_id")
        if args.command == "neighbors":
            result = direct_neighbors(graph, args.node_id)
        elif args.command == "upstream":
            result = walk(graph, args.node_id, "upstream", max_depth=args.depth)
        elif args.command == "downstream":
            result = walk(graph, args.node_id, "downstream", max_depth=args.depth)
        elif args.command == "score-trace":
            result = score_trace(graph, args.node_id, max_depth=args.depth)
        else:
            raise SystemExit(f"Unsupported command: {args.command}")

    print(json.dumps(result, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
