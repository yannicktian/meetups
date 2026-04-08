"use client";

import { motion } from "framer-motion";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

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
      {/* Groups */}
      {groups.map((group, i) => (
        <motion.g
          key={group.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <rect
            x={group.x}
            y={group.y}
            width={group.width}
            height={group.height}
            rx={12}
            fill={group.color || "#141416"}
            fillOpacity={0.3}
            stroke={group.color || "#5c5c66"}
            strokeOpacity={0.3}
            strokeWidth={1}
          />
          <text
            x={group.x + 12}
            y={group.y + 20}
            fill="#5c5c66"
            fontSize={11}
            fontFamily="monospace"
          >
            {group.label}
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
              stroke="#5c5c66"
              strokeWidth={1.5}
              strokeDasharray={edge.animated ? "6 4" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.6 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
            />
            {edge.label && (
              <motion.text
                x={(start.x + end.x) / 2}
                y={(start.y + end.y) / 2 - 8}
                fill="#5c5c66"
                fontSize={10}
                fontFamily="monospace"
                textAnchor="middle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                {edge.label}
              </motion.text>
            )}
          </motion.g>
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <motion.g
          key={node.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 200 }}
          style={{ transformOrigin: `${node.x + node.width / 2}px ${node.y + node.height / 2}px` }}
        >
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            rx={8}
            fill={node.color || "#141416"}
            stroke={node.color || "#6366f1"}
            strokeOpacity={0.7}
            strokeWidth={1.5}
          />
          <text
            x={node.x + node.width / 2}
            y={node.y + node.height / 2 + 4}
            fill="#fafafa"
            fontSize={13}
            fontFamily="system-ui"
            textAnchor="middle"
            fontWeight={500}
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
