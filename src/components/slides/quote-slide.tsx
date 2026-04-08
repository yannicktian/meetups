"use client";

import { motion } from "framer-motion";

type Props = {
  quote: string;
  author: string;
  source?: string;
  accent?: string;
};

export function QuoteSlide({ quote, author, source, accent }: Props) {
  const accentColor = accent || "var(--accent)";

  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto">
      <motion.div
        className="text-8xl md:text-[12rem] leading-none font-serif"
        style={{ color: accentColor, opacity: 0.2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        &ldquo;
      </motion.div>

      <motion.blockquote
        className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text-primary)] -mt-8 md:-mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        {quote}
      </motion.blockquote>

      <motion.div
        className="flex flex-col gap-1 items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span
          className="text-base md:text-lg font-bold"
          style={{ color: accentColor }}
        >
          — {author}
        </span>
        {source && (
          <span className="text-sm text-[var(--text-muted)] font-mono">
            {source}
          </span>
        )}
      </motion.div>
    </div>
  );
}
