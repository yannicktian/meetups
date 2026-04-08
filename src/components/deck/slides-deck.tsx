"use client";

import { useSlideNav } from "@/lib/use-slide-nav";
import { SlideWrapper } from "./slide-wrapper";
import { TopNavBar } from "./top-nav-bar";
import { registry } from "@/lib/registry";
import { StageNavProvider } from "@/lib/stage-nav-context";
import type { Slide } from "@/lib/types";

type Props = {
  slides: Slide[];
};

export function SlidesDeck({ slides }: Props) {
  return (
    <StageNavProvider>
      <SlidesDeckInner slides={slides} />
    </StageNavProvider>
  );
}

function SlidesDeckInner({ slides }: Props) {
  const { currentIndex, total, currentSection, goToSection } = useSlideNav(slides);

  return (
    <>
      {/* Top navigation bar */}
      <TopNavBar currentSection={currentSection} onSectionClickAction={goToSection} />

      {/* Horizontal scroll container */}
      <main className="slides-deck-container h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory flex flex-row">
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
              <Component
                {...slide.props}
                title={slide.title}
                subtitle={slide.subtitle}
                slideId={slide.id}
              />
            </SlideWrapper>
          );
        })}
      </main>

      {/* Progress bar at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-1 bg-[var(--bg-surface-alt)] z-50">
        <div
          className="h-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-3 right-6 text-xs text-[var(--text-muted)] font-mono z-50 bg-white/80 backdrop-blur px-2 py-1 rounded-md border border-[var(--border)]">
        {currentIndex + 1} / {total}
      </div>
    </>
  );
}
