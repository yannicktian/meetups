"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  color?: string;
};

export function TransitionSlide({ title, subtitle, color }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-6">
      <motion.div
        className="w-24 h-1.5 rounded-full mb-2"
        style={{ background: color || "var(--accent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.h2
        className="text-5xl md:text-7xl font-bold text-[var(--text-primary)] leading-tight"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl text-[var(--text-secondary)] font-light max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
