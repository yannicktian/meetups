"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
};

export function HeroSlide({ title, subtitle, badge }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 max-w-5xl mx-auto">
      {badge && (
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full text-xs md:text-sm font-mono uppercase tracking-widest font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[var(--accent)]/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {badge}
        </motion.span>
      )}
      <motion.h1
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight bg-gradient-to-br from-[var(--text-primary)] via-[var(--text-primary)] to-[var(--accent)] bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] max-w-3xl font-light"
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
