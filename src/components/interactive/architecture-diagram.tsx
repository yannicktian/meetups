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

function getNodeCenter(node: DiagramNode) {
  return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
}

// Add alpha to a hex color (e.g., "#10b981" + "1a" → light tint)
function withAlpha(hex: string, alpha: string): string {
  return hex + alpha;
}

export function ArchitectureDiagram({
  nodes,
  edges,
  groups = [],
  width = 800,
  height = 500,
}: Props) {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

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

      {/* Edges */}
      {edges.map((edge, i) => {
        const from = nodeMap.get(edge.from);
        const to = nodeMap.get(edge.to);
        if (!from || !to) return null;
        const start = getNodeCenter(from);
        const end = getNodeCenter(to);

        return (
          <motion.g key={`${edge.from}-${edge.to}`}>
            <motion.line
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="#a1a1aa"
              strokeWidth={1.75}
              strokeDasharray={edge.animated ? "6 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            />
            {edge.label && (
              <motion.g
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {/* Label background pill */}
                <rect
                  x={(start.x + end.x) / 2 - edge.label.length * 3.5}
                  y={(start.y + end.y) / 2 - 10}
                  width={edge.label.length * 7}
                  height={16}
                  rx={8}
                  fill="#fafaf9"
                  stroke="#e7e5e4"
                  strokeWidth={0.5}
                />
                <text
                  x={(start.x + end.x) / 2}
                  y={(start.y + end.y) / 2 + 1}
                  fill="#52525b"
                  fontSize={10}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={500}
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

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
    </svg>
  );
}
