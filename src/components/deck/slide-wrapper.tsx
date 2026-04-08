"use client";

import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";
import type { SlideSection } from "@/lib/types";
import { SECTION_COLORS } from "@/lib/types";

type Props = {
  id: string;
  section: SlideSection;
  children: React.ReactNode;
};

export function SlideWrapper({ id, section, children }: Props) {
  const { ref, isInView } = useInView(0.3);

  return (
    <section
      id={id}
      ref={ref}
      className="relative h-screen w-full snap-start snap-always flex items-center justify-center overflow-hidden"
    >
      {/* Section accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full"
        style={{ background: SECTION_COLORS[section] }}
      />

      <motion.div
        className="w-full max-w-6xl mx-auto px-8 md:px-16"
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </section>
  );
}
