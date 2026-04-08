"use client";

import { useEffect, useState, useCallback } from "react";
import type { Slide } from "./types";

export function useSlideNav(slides: Slide[]) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sync hash → index on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const idx = slides.findIndex((s) => s.id === hash);
      if (idx !== -1) {
        setCurrentIndex(idx);
        document.getElementById(hash)?.scrollIntoView();
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

  // Keyboard navigation
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(slides.length - 1, index));
      document.getElementById(slides[clamped].id)?.scrollIntoView({
        behavior: "smooth",
      });
    },
    [slides]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        goTo(currentIndex + 1);
      } else if (
        e.key === "ArrowUp" ||
        e.key === "PageUp" ||
        (e.key === " " && e.shiftKey)
      ) {
        e.preventDefault();
        goTo(currentIndex - 1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentIndex, goTo]);

  return { currentIndex, total: slides.length, goTo };
}
