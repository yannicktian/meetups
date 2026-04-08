"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import type { Prerequisite } from "@/lib/types";

type Props = {
  jobTitle: string;
  jobCompany: string;
  prerequisites: Prerequisite[];
  autoPlay?: boolean;
};

export function PrerequisiteSetup({
  jobTitle,
  jobCompany,
  prerequisites,
  autoPlay = true,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [items, setItems] = useState<Prerequisite[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (!autoPlay) {
      setItems(prerequisites);
      setVisibleCount(prerequisites.length);
      return;
    }

    setIsStreaming(true);
    setVisibleCount(0);
    setItems([]);

    const timers: NodeJS.Timeout[] = [];
    prerequisites.forEach((prereq, i) => {
      timers.push(
        setTimeout(() => {
          setItems((prev) => [...prev, prereq]);
          setVisibleCount(i + 1);
          if (i === prerequisites.length - 1) {
            setIsStreaming(false);
          }
        }, 800 + i * 600)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [prerequisites, autoPlay]);

  return (
    <div className="flex gap-8 w-full max-w-4xl mx-auto">
      {/* Job posting card */}
      <div className="flex-shrink-0 w-64">
        <div className="bg-[var(--bg-surface)] rounded-xl p-5 border border-[var(--bg-surface-hover)]">
          <div className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider mb-3">
            Job Posting
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{jobTitle}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{jobCompany}</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-full" />
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-3/4" />
            <div className="h-2 bg-[var(--bg-surface-hover)] rounded-full w-5/6" />
          </div>
        </div>
      </div>

      {/* Prerequisites list */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Prerequisites</h3>
          {isStreaming && (
            <motion.div
              className="flex gap-1 items-center"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-xs text-[var(--accent-bright)]">streaming...</span>
            </motion.div>
          )}
        </div>

        <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-2">
          <AnimatePresence mode="popLayout">
            {items.slice(0, visibleCount).map((prereq) => (
              <Reorder.Item
                key={prereq.label}
                value={prereq}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-[var(--bg-surface)] rounded-lg p-4 border border-[var(--bg-surface-hover)] cursor-grab active:cursor-grabbing"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text-primary)]">
                        {prereq.label}
                      </span>
                      <span
                        className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          prereq.type === "eliminatory"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {prereq.type}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {prereq.description}
                    </p>
                  </div>
                  <div className="flex gap-1 mt-1">
                    <div className="w-4 h-4 rounded border border-[var(--text-muted)] opacity-40" />
                  </div>
                </div>
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      </div>
    </div>
  );
}
