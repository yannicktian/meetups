"use client";

import { motion } from "framer-motion";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Props = {
  quote: string;
  author: string;
  source?: string;
  accent?: string;
};

export function QuoteSlide({ quote, author, source, accent }: Props) {
  const accentColor = accent || "var(--accent)";

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 md:gap-8 max-w-4xl mx-auto">
      <motion.div
        className="text-8xl md:text-[10rem] lg:text-[12rem] leading-none font-serif"
        style={{ color: accentColor, opacity: 0.2 }}
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 0.2, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6 }}
      >
        &ldquo;
      </motion.div>

      <motion.blockquote
        className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text-primary)] -mt-6 md:-mt-12 lg:-mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        {quote}
      </motion.blockquote>

      <motion.div
        className="flex flex-col gap-1 items-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.5 }}
      >
        <span className="text-lg md:text-xl font-bold" style={{ color: accentColor }}>
          — {author}
        </span>
        {source && (
          <span className="text-sm md:text-base text-[var(--text-muted)] font-mono">
            {source}
          </span>
        )}
      </motion.div>
    </div>
  );
}
