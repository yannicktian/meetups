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
  pattern: "var(--pattern-soft)",
  vision: "var(--vision-soft)",
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
      className="relative h-screen w-screen flex-shrink-0 snap-start snap-always flex items-center justify-center overflow-hidden bg-[var(--bg-primary)]"
      style={{ paddingTop: "var(--nav-height)" }}
    >
      {/* Subtle section-tinted background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at top, ${sectionBg} 0%, transparent 70%)`,
          opacity: 0.7,
        }}
      />

      {/* Section accent bar at top of slide content */}
      <div
        className="absolute left-0 h-1 w-full"
        style={{ background: accent, top: "var(--nav-height)" }}
      />

      {/* Content container intentionally has no overflow clipping so child
       * box-shadows (avatar, cards, code blocks, etc.) can extend beyond the
       * content box. Tall slides must fit the viewport by their own layout —
       * the parent <section> handles final clipping at the viewport edge. */}
      <motion.div
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
