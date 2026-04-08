"use client";

import { useEffect, useState, useCallback } from "react";
import type { Slide, SlideSection } from "./types";
import { useStageNav } from "./stage-nav-context";

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
    (index: number, options?: { instant?: boolean }) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      document.getElementById(slides[clamped].id)?.scrollIntoView({
        behavior: options?.instant ? "instant" : "smooth",
        inline: "start",
        block: "nearest",
      });
    },
    [slides]
  );

  // Jump to the first slide of a given section — instant, no intermediate scroll
  const goToSection = useCallback(
    (sectionId: SlideSection) => {
      const idx = slides.findIndex((s) => s.section === sectionId);
      if (idx !== -1) goTo(idx, { instant: true });
    },
    [slides, goTo]
  );

  const stageNav = useStageNav();

  // Keyboard navigation — left/right arrows for horizontal scroll
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;

      const activeSlideId = slides[currentIndex]?.id;
      const stageHandlers = activeSlideId ? stageNav?.getHandlers(activeSlideId) : undefined;

      const isNextKey =
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === "ArrowDown" ||
        (e.key === " " && !e.shiftKey);

      const isPrevKey =
        e.key === "ArrowLeft" ||
        e.key === "PageUp" ||
        e.key === "ArrowUp" ||
        (e.key === " " && e.shiftKey);

      if (isNextKey) {
        e.preventDefault();
        // Give the active slide a chance to consume the press first.
        if (stageHandlers?.onNextRequest?.()) return;
        goTo(currentIndex + 1);
      } else if (isPrevKey) {
        e.preventDefault();
        if (stageHandlers?.onPrevRequest?.()) return;
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
  }, [currentIndex, goTo, slides, slides.length, stageNav]);

  const currentSection = slides[currentIndex]?.section;

  return { currentIndex, total: slides.length, currentSection, goTo, goToSection };
}
