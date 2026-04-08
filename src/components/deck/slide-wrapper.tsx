"use client";

import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import type { SlideSection } from "@/lib/types";
import { SECTION_COLORS } from "@/lib/types";

const SECTION_BG: Record<SlideSection, string> = {
  intro: "var(--intro-soft)",
  alpha: "var(--alpha-soft)",
  saas: "var(--saas-soft)",
  agent: "var(--agent-soft)",
  future: "var(--future-soft)",
};

type Props = {
  id: string;
  section: SlideSection;
  children: React.ReactNode;
};

export function SlideWrapper({ id, section, children }: Props) {
  const { ref, isInView } = useInView(0.3);
  const accent = SECTION_COLORS[section];
  const sectionBg = SECTION_BG[section];

  return (
    <section
      id={id}
      ref={ref}
      className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]"
    >
      {/* Subtle section-tinted background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${sectionBg} 0%, transparent 70%)`,
          opacity: 0.6,
        }}
      />

      {/* Section accent bar at top */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: accent }}
      />

      {/* Section label badge in top-left corner */}
      <div className="absolute top-6 left-8 md:left-16 z-10">
        <div
          className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest"
          style={{
            background: `${accent}1a`,
            color: accent,
          }}
        >
          {section}
        </div>
      </div>

      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-8 md:px-16"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
