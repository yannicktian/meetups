"use client";

import { useSlideNav } from "@/lib/use-slide-nav";
import { SlideWrapper } from "./slide-wrapper";
import { registry } from "@/lib/registry";
import type { Slide } from "@/lib/types";

type Props = {
  slides: Slide[];
};

export function SlidesDeck({ slides }: Props) {
  const { currentIndex, total } = useSlideNav(slides);

  return (
    <>
      <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
        {slides.map((slide) => {
          const Component = registry[slide.component];
          if (!Component) {
            return (
              <SlideWrapper key={slide.id} id={slide.id} section={slide.section}>
                <p className="text-red-500">Unknown component: {slide.component}</p>
              </SlideWrapper>
            );
          }
          return (
            <SlideWrapper key={slide.id} id={slide.id} section={slide.section}>
              <Component {...slide.props} title={slide.title} subtitle={slide.subtitle} />
            </SlideWrapper>
          );
        })}
      </main>

      {/* Progress bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[var(--bg-surface-alt)] z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-4 right-6 text-xs text-[var(--text-muted)] font-mono z-50 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-[var(--border)]">
        {currentIndex + 1} / {total}
      </div>
    </>
  );
}
