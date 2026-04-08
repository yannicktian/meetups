"use client";

import { motion } from "framer-motion";

type Props = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  children?: React.ReactNode;
  reversed?: boolean;
};

export function NarrativeSlide({ title, subtitle, bullets, children, reversed }: Props) {
  return (
    <div className={`flex flex-col md:flex-row items-center gap-12 ${reversed ? "md:flex-row-reverse" : ""}`}>
      {/* Text side */}
      <div className="flex-1 flex flex-col gap-4">
        <motion.h2
          className="text-3xl md:text-5xl font-bold"
          initial={{ opacity: 0, x: reversed ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
        {bullets && (
          <motion.ul className="flex flex-col gap-3 mt-2">
            {bullets.map((bullet, i) => (
              <motion.li
                key={i}
                className="text-lg text-[var(--text-secondary)] flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <span className="text-[var(--accent-bright)] mt-1">&#9656;</span>
                {bullet}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>

      {/* Visual side */}
      {children && (
        <motion.div
          className="flex-1 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
