"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "@/lib/use-in-view";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type StatItem = {
  value: number;
  suffix?: string;
  label: string;
};

type Props = {
  title?: string;
  stats: StatItem[];
};

function AnimatedCounter({ value, suffix }: { value: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) =>
    v >= 1_000_000
      ? `${(v / 1_000_000).toFixed(1)}M`
      : v >= 1_000
        ? `${Math.round(v / 1_000)}K`
        : Math.round(v).toLocaleString()
  );
  const { ref, isInView } = useInView(0.5);

  useEffect(() => {
    if (isInView) {
      count.set(0);
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref as React.RefObject<HTMLSpanElement>}>
      <motion.span>{rounded}</motion.span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}

export function StatsSlide({ title, stats }: Props) {
  return (
    <div className="flex flex-col items-center gap-12">
      {title && (
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
      )}
      <div className="flex flex-wrap justify-center gap-16">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col items-center gap-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.2 + i * 0.15 }}
          >
            <span className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="text-sm md:text-base text-[var(--text-secondary)] uppercase tracking-wider">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
