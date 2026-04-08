"use client";

import { useEffect, useState, useCallback } from "react";
import type { Slide, SlideSection } from "./types";

export function useSlideNav(slides: Slide[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync hash → index on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const idx = slides.findIndex((s) => s.id === hash);
      if (idx !== -1) {
        setCurrentIndex(idx);
        document.getElementById(hash)?.scrollIntoView({ inline: "start", block: "nearest" });
      }
    }
  }, [slides]);

  // Observe which slide is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = slides.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) {
              setCurrentIndex(idx);
              window.history.replaceState(null, "", `#${slides[idx].id}`);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    const elements = slides
      .map((s) => document.getElementById(s.id))
      .filter(Boolean) as HTMLElement[];

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [slides]);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      document.getElementById(slides[clamped].id)?.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [slides]
  );

  // Jump to the first slide of a given section
  const goToSection = useCallback(
    (sectionId: SlideSection) => {
      const idx = slides.findIndex((s) => s.section === sectionId);
      if (idx !== -1) goTo(idx);
    },
    [slides, goTo]
  );

  // Keyboard navigation — left/right arrows for horizontal scroll
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Allow text inputs to work normally
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      if (
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "PageDown" ||
        e.key === "ArrowDown"
      ) {
        e.preventDefault();
        goTo(currentIndex + 1);
      } else if (
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        e.key === "ArrowUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        e.preventDefault();
        goTo(currentIndex - 1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(0);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, goTo, slides.length]);

  const currentSection = slides[currentIndex]?.section;

  return { currentIndex, total: slides.length, currentSection, goTo, goToSection };
}
