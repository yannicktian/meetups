"use client";

import { motion } from "framer-motion";
import { ArchitectureDiagram } from "@/components/interactive/architecture-diagram";
import type { DiagramNode, DiagramEdge, DiagramGroup } from "@/lib/types";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Props = {
  title: string;
  subtitle?: string;
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  groups?: DiagramGroup[];
  width?: number;
  height?: number;
};

export function ArchitectureSlide({
  title,
  subtitle,
  nodes,
  edges,
  groups,
  width,
  height,
}: Props) {
  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mt-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        className="w-full max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
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
