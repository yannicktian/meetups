"use client";

import { motion, AnimatePresence, Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { GripVertical, FileText } from "lucide-react";
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
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-4xl mx-auto">
      {/* Job posting card */}
      <div className="w-full md:flex-shrink-0 md:w-64">
        <div className="bg-white rounded-xl p-5 border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-[var(--text-muted)]" />
            <span className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-wider font-semibold">
              Job Posting
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] leading-tight">
            {jobTitle}
          </h3>
          <p className="text-base text-[var(--text-secondary)] mt-1">{jobCompany}</p>
          <div className="mt-4 flex flex-col gap-2">
            <div className="h-2 bg-[var(--bg-surface-alt)] rounded-full w-full" />
            <div className="h-2 bg-[var(--bg-surface-alt)] rounded-full w-3/4" />
            <div className="h-2 bg-[var(--bg-surface-alt)] rounded-full w-5/6" />
            <div className="h-2 bg-[var(--bg-surface-alt)] rounded-full w-2/3" />
          </div>
        </div>
      </div>

      {/* Prerequisites list */}
      <div className="flex-1 flex flex-col gap-3 min-w-0 w-full">
        <div className="flex items-center gap-3 mb-1">
          <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">Prerequisites</h3>
          {isStreaming && (
            <motion.div
              className="flex gap-2 items-center bg-[var(--accent-soft)] px-2.5 py-1 rounded-full"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              <span className="text-[10px] text-[var(--accent)] font-semibold uppercase tracking-wider">
                Streaming
              </span>
            </motion.div>
          )}
        </div>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="flex flex-col gap-2"
        >
          <AnimatePresence mode="popLayout">
            {items.slice(0, visibleCount).map((prereq) => (
              <Reorder.Item
                key={prereq.label}
                value={prereq}
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg p-4 border border-[var(--border)] shadow-sm cursor-grab active:cursor-grabbing hover:border-[var(--accent)] transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="w-4 h-4 text-[var(--text-muted)] mt-1 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-base md:text-lg text-[var(--text-primary)]">
                        {prereq.label}
                      </span>
                      <span
                        className={`text-[10px] md:text-xs font-mono uppercase px-1.5 py-0.5 rounded font-bold tracking-wider ${
                          prereq.type === "eliminatory"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {prereq.type}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-[var(--text-secondary)] mt-1">
                      {prereq.description}
                    </p>
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
