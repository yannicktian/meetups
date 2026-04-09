"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "@/lib/use-in-view";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type StatItem = {
  value: number;
  from?: number;
  suffix?: string;
  label: string;
};

type Props = {
  title?: string;
  stats: StatItem[];
};

type Scale = "M" | "K" | "raw";

function getScale(target: number): Scale {
  if (target >= 1_000_000) return "M";
  if (target >= 1_000) return "K";
  return "raw";
}

/** Format a counter value at a fixed scale. Keeping the scale fixed for
 * the duration of the animation ensures intermediate strings are never
 * wider than the final string — so the row never reflows mid-animation. */
function formatAtScale(v: number, scale: Scale): string {
  if (scale === "M") return `${Math.round(v / 1_000_000)}M`;
  if (scale === "K") return `${Math.round(v / 1_000)}K`;
  return Math.round(v).toLocaleString();
}

/** Format a static value using auto-detected scale — used by the
 * ComparisonCounter's "from" display. */
function formatValue(v: number): string {
  return formatAtScale(v, getScale(v));
}

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const scale = getScale(value);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => formatAtScale(v, scale));
  const { ref, isInView } = useInView(0.5);

  useEffect(() => {
    if (isInView) {
      count.set(0);
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, value]);

  // Scale-based formatting guarantees intermediate strings are never wider
  // than the final value — no ghost placeholder needed, and the counter
  // stays a direct child of the bg-clip-text parent (gradient renders).
  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

function ComparisonCounter({ from, to }: { from: number; to: number }) {
  return (
    <span className="inline-flex items-baseline gap-3 md:gap-4">
      <span className="text-[var(--text-muted)] line-through decoration-[0.08em] opacity-50 text-5xl md:text-6xl lg:text-7xl">
        {formatValue(from)}
      </span>
      <span className="text-[var(--text-muted)] text-4xl md:text-5xl lg:text-6xl font-light">
        →
      </span>
      <span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
        <AnimatedCounter value={to} />
      </span>
    </span>
  );
}

export function StatsSlide({ title, stats }: Props) {
  return (
    <div className="flex flex-col items-center gap-8 md:gap-12">
      {title && (
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
      )}
      <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-10 md:gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span className="text-6xl md:text-7xl lg:text-8xl font-bold">
              {stat.from !== undefined ? (
                <ComparisonCounter from={stat.from} to={stat.value} />
              ) : (
                <span className="bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </span>
              )}
            </span>
            <span className="text-base md:text-lg lg:text-xl text-[var(--text-secondary)] uppercase tracking-wider font-medium">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
