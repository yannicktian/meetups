"use client";

import { motion } from "framer-motion";

type HeroEvent = {
  name?: string;
  date?: string;
  location?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  event?: HeroEvent;
  hosts?: string;
  acknowledgment?: string;
};

export function HeroSlide({
  title,
  subtitle,
  badge,
  event,
  hosts,
  acknowledgment,
}: Props) {
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

      {/* Event details block */}
      {event && (
        <motion.div
          className="flex flex-col gap-2 items-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {event.name && (
            <div className="text-base md:text-lg font-bold text-[var(--text-primary)]">
              {event.name}
            </div>
          )}
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm md:text-base text-[var(--text-secondary)]">
            {event.date && <span className="font-medium">{event.date}</span>}
            {event.date && event.location && <span className="text-[var(--text-muted)]">·</span>}
            {event.location && <span>{event.location}</span>}
          </div>
        </motion.div>
      )}

      {/* Hosts + acknowledgment */}
      {(hosts || acknowledgment) && (
        <motion.div
          className="flex flex-col gap-1 items-center mt-2 pt-6 border-t border-[var(--border)] w-full max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {hosts && (
            <div className="text-sm md:text-base text-[var(--text-secondary)]">
              Hosted by <span className="font-bold text-[var(--text-primary)]">{hosts}</span>
            </div>
          )}
          {acknowledgment && (
            <div className="text-xs md:text-sm text-[var(--text-muted)] italic">
              {acknowledgment}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
