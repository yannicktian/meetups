"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  color?: string;
};

export function TransitionSlide({ title, subtitle, color }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4">
      <motion.div
        className="w-16 h-1 rounded-full mb-4"
        style={{ background: color || "var(--accent)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h2
        className="text-4xl md:text-6xl font-bold"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p
          className="text-lg md:text-xl text-[var(--text-secondary)]"
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
