"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function HeroSlide({ title, subtitle, badge }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      {badge && (
        <motion.span
          className="text-sm font-mono uppercase tracking-widest text-[var(--accent-bright)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
