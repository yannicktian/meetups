"use client";

import { motion } from "framer-motion";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Props = {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;
  height?: number;
};

// Add alpha to a hex color (e.g., "#10b981" + "1a" → light tint)
function withAlpha(hex: string, alpha: string): string {
  return hex + alpha;
}

/** Pick an edge's start/end points on the source and target node borders
 * (not the node centers), so the line never runs through the rectangles
 * and the midpoint sits in the gap between them. Uses the dominant axis
 * to decide which side of each node to attach to. */
function getEdgePoints(from: DiagramNode, to: DiagramNode) {
  const fromCx = from.x + from.width / 2;
  const fromCy = from.y + from.height / 2;
  const toCx = to.x + to.width / 2;
  const toCy = to.y + to.height / 2;
  const dx = toCx - fromCx;
  const dy = toCy - fromCy;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Primarily horizontal — attach to left/right edges
    return {
      start: {
        x: dx > 0 ? from.x + from.width : from.x,
        y: fromCy,
      },
      end: {
        x: dx > 0 ? to.x : to.x + to.width,
        y: toCy,
      },
    };
  }
  // Primarily vertical — attach to top/bottom edges
  return {
    start: {
      x: fromCx,
      y: dy > 0 ? from.y + from.height : from.y,
    },
    end: {
      x: toCx,
      y: dy > 0 ? to.y : to.y + to.height,
    },
  };
}

export function ArchitectureDiagram({
  nodes,
  edges,
  groups = [],
  width = 800,
  height = 500,
}: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Precompute each edge's resolved endpoints so we can render the line
  // and the label in separate passes (line → behind nodes, label → in
  // front of nodes) without recomputing geometry.
  const edgeLayouts = edges
    .map((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (!from || !to) return null;
      const { start, end } = getEdgePoints(from, to);
      return { edge, start, end };
    })
    .filter((l): l is NonNullable<typeof l> => l !== null);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto"
      fill="none"
    >
      {/* Drop shadow filter */}
      <defs>
        <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.08" />
        </filter>
      </defs>

      {/* Groups */}
      {groups.map((group, i) => (
        <motion.g
          key={group.id}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: i * 0.1 }}
        >
          <rect
            x={group.x}
            y={group.y}
            width={group.width}
            height={group.height}
            rx={14}
            fill={group.color ? withAlpha(group.color, "0d") : "#f5f5f4"}
            stroke={group.color || "#d6d3d1"}
            strokeOpacity={0.4}
            strokeWidth={1.5}
            strokeDasharray="6 4"
          />
          <text
            x={group.x + 14}
            y={group.y + 22}
            fill={group.color || "#71717a"}
            fontSize={11}
            fontFamily="ui-monospace, monospace"
            fontWeight={600}
            letterSpacing={0.5}
          >
            {group.label.toUpperCase()}
          </text>
        </motion.g>
      ))}

      {/* Edge lines (rendered behind nodes) */}
      {edgeLayouts.map(({ edge, start, end }, i) => (
        <motion.line
          key={`line-${edge.from}-${edge.to}`}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke="#a1a1aa"
          strokeWidth={1.75}
          strokeDasharray={edge.animated ? "6 4" : undefined}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.7 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200 }}
          style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
        >
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={10}
            fill="#ffffff"
            stroke={node.color || "#6366f1"}
            strokeWidth={2}
            filter="url(#node-shadow)"
          />
          {/* Top accent strip */}
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={4}
            rx={10}
            fill={node.color || "#6366f1"}
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height / 2 + 6}
            fill="#18181b"
            fontSize={13}
            fontFamily="system-ui, sans-serif"
            textAnchor="middle"
            fontWeight={600}
          >
            {node.label}
          </text>
        </motion.g>
      ))}

      {/* Edge labels (rendered on top of nodes so short gaps never clip them) */}
      {edgeLayouts.map(({ edge, start, end }, i) => {
        if (!edge.label) return null;
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const textWidth = edge.label.length * 6.2;
        const padX = 6;
        return (
          <motion.g
            key={`label-${edge.from}-${edge.to}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.9 + i * 0.1 }}
          >
            <rect
              x={midX - textWidth / 2 - padX}
              y={midY - 9}
              width={textWidth + padX * 2}
              height={18}
              rx={9}
              fill="#fafaf9"
              stroke="#d6d3d1"
              strokeWidth={1}
            />
            <text
              x={midX}
              y={midY + 3}
              fill="#52525b"
              fontSize={10}
              fontFamily="ui-monospace, monospace"
              fontWeight={500}
              textAnchor="middle"
            >
              {edge.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
