"use client";

import { motion } from "framer-motion";
import { ArchitectureDiagram } from "@/components/interactive/architecture-diagram";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

type Props = {
  title: string;
  subtitle?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;
  height?: number;
};

export function ArchitectureSlide({ title, subtitle, nodes, edges, groups, width, height }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)] mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <ArchitectureDiagram
          nodes={nodes}
          edges={edges}
          groups={groups}
          width={width}
          height={height}
        />
      </motion.div>
    </div>
  );
}
