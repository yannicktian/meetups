"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Side = {
  label: string;
  title: string;
  bullets: string[];
  icon?: string;
  color?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  left: Side;
  right: Side;
};

function SideCard({ side, index, isHighlighted }: { side: Side; index: number; isHighlighted: boolean }) {
  const Icon = getIcon(side.icon);
  const accentColor = side.color || (isHighlighted ? "var(--accent)" : "var(--text-muted)");

  return (
    <motion.div
      className="flex-1 bg-white rounded-2xl border-2 p-6 md:p-8 shadow-sm"
      style={{
        borderColor: isHighlighted ? accentColor : "var(--border)",
      }}
      initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
      whileInView={{ opacity: isHighlighted ? 1 : 0.85, x: 0 }}
      viewport={VIEWPORT}
      transition={{ delay: 0.3 + index * 0.15 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              background: `${accentColor}1a`,
              color: accentColor,
            }}
          >
            <Icon className="w-5 h-5" strokeWidth={2.25} />
          </div>
        )}
        <span
          className="text-[10px] font-mono font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {side.label}
        </span>
      </div>
      <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
        {side.title}
      </h3>
      <ul className="flex flex-col gap-2">
        {side.bullets.map((bullet, i) => (
          <li
            key={i}
            className="text-sm md:text-base text-[var(--text-secondary)] flex items-start gap-2"
          >
            <span className="text-[var(--text-muted)] mt-1 flex-shrink-0">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export function ComparisonSlide({ title, subtitle, left, right }: Props) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 relative">
        <SideCard side={left} index={0} isHighlighted={false} />

        {/* Arrow separator */}
        <motion.div
          className="hidden md:flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.55 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: right.color || "var(--accent-soft)",
            }}
          >
            <ArrowRight
              className="w-6 h-6"
              style={{ color: right.color || "var(--accent)" }}
              strokeWidth={2.5}
            />
          </div>
        </motion.div>

        <SideCard side={right} index={1} isHighlighted={true} />
      </div>
    </div>
  );
}
