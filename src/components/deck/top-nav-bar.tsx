"use client";

import { motion } from "framer-motion";
import { SECTIONS, type SlideSection } from "@/lib/types";

type Props = {
  currentSection: SlideSection | undefined;
  onSectionClickAction: (sectionId: SlideSection) => void;
};

export function TopNavBar({ currentSection, onSectionClickAction }: Props) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--border)]"
      style={{ height: "var(--nav-height)" }}
    >
      <div className="h-full w-full max-w-6xl mx-auto px-3 md:px-8 flex items-center justify-between gap-2 md:gap-4">
        {/* Brand / talk title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: currentSection
                ? SECTIONS.find((s) => s.id === currentSection)?.color
                : "var(--accent)",
            }}
          />
          <span className="text-xs md:text-sm font-mono font-semibold text-[var(--text-primary)] hidden md:inline">
            Year of Harnesses
          </span>
        </div>

        {/* Section pills */}
        <div className="flex items-center gap-1 md:gap-1.5 flex-1 justify-center md:justify-center overflow-x-auto scrollbar-hide">
          {SECTIONS.map((section) => {
            const isActive = section.id === currentSection;
            return (
              <button
                key={section.id}
                onClick={(e) => {
                  onSectionClickAction(section.id);
                  e.currentTarget.blur();
                }}
                className="relative px-2 md:px-3.5 py-1.5 md:py-2 rounded-full text-[11px] md:text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer focus:outline-none focus-visible:outline-none"
                style={{
                  color: isActive ? "white" : "var(--text-secondary)",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute inset-0 rounded-full shadow-sm"
                    style={{ background: section.color }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 hidden md:inline">{section.label}</span>
                <span className="relative z-10 md:hidden">{section.short}</span>
              </button>
            );
          })}
        </div>

        {/* Spacer to balance the brand on the left (desktop only) */}
        <div className="flex-shrink-0 w-0 md:w-32 hidden md:block" />
      </div>
    </nav>
  );
}
