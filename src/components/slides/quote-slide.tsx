"use client";

import { motion } from "framer-motion";

type Props = {
  quote: string;
  author: string;
  source?: string;
  accent?: string;
};

export function QuoteSlide({ quote, author, source, accent }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-8 max-w-4xl mx-auto">
      <motion.div
        className="text-7xl md:text-9xl leading-none font-serif"
        style={{ color: accent || "var(--accent-bright)" }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        &ldquo;
      </motion.div>

      <motion.blockquote
        className="text-2xl md:text-4xl font-light leading-snug text-[var(--text-primary)]"
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
          className="text-base md:text-lg font-semibold"
          style={{ color: accent || "var(--accent-bright)" }}
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
