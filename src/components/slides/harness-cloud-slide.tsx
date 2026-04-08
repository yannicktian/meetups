"use client";

import { motion, useReducedMotion } from "framer-motion";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useStageNav } from "@/lib/stage-nav-context";
import { useInView } from "@/lib/use-in-view";

type Bucket = {
  label: string;
  color: string;
  chips: string[];
};

type Props = {
  stage1Heading: string;
  stage2Heading: string;
  stage2Subtitle: string;
  buckets: Bucket[];
};

/** Two-stage chip-cloud → bucket-grid slide.
 *
 * Stage 1: chips drift in from random edge positions, heading reads
 *          `stage1Heading`.
 * Stage 2: chips animate into a structured grid grouped by bucket,
 *          heading crossfades to `stage2Heading` + `stage2Subtitle`.
 *
 * The slide registers `onNextRequest` / `onPrevRequest` interceptors
 * with the deck via `useStageNav`, so right/left arrows advance stages
 * before the deck moves slides. Reverse symmetry supported.
 */
export function HarnessCloudSlide({
  stage1Heading,
  stage2Heading,
  stage2Subtitle,
  buckets,
}: Props) {
  const [stage, setStage] = useState<1 | 2>(1);
  const stageNav = useStageNav();
  const reducedMotion = useReducedMotion();
  const { ref: viewRef, isInView } = useInView(0.3);

  // Reset stage to 1 when the slide leaves the viewport so the climax
  // re-fires next time the slide comes into view.
  useEffect(() => {
    if (!isInView) {
      startTransition(() => setStage(1));
    }
  }, [isInView]);

  // Register stage interceptors so right/left arrows advance stage 1 → 2 →
  // next slide and the reverse.
  useEffect(() => {
    if (!stageNav) return;
    const slideId = "harness-cloud";
    stageNav.register(slideId, {
      onNextRequest: () => {
        if (stage === 1) {
          setStage(2);
          return true; // consumed
        }
        return false; // let the deck advance to the next slide
      },
      onPrevRequest: () => {
        if (stage === 2) {
          setStage(1);
          return true;
        }
        return false;
      },
    });
    return () => stageNav.unregister(slideId);
  }, [stage, stageNav]);

  type ChipMeta = {
    id: string;
    label: string;
    color: string;
    bucketIdx: number;
    bucketLabel: string;
    stage1X: number; // percentage
    stage1Y: number; // percentage
    delay: number;
  };

  const chips = useMemo<ChipMeta[]>(() => {
    // Deterministic LCG so chip positions are stable across renders.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const all: ChipMeta[] = [];
    buckets.forEach((bucket, bucketIdx) => {
      bucket.chips.forEach((label, chipIdx) => {
        const bandRoll = rand();
        const xRoll = rand();
        const yRoll = rand();

        // Four edge bands: top / bottom / left / right. Keeps the center
        // ~25%-75% region clear so the heading card stays readable.
        let x: number;
        let y: number;
        if (bandRoll < 0.25) {
          x = 4 + xRoll * 88;
          y = 3 + yRoll * 14;
        } else if (bandRoll < 0.5) {
          x = 4 + xRoll * 88;
          y = 80 + yRoll * 17;
        } else if (bandRoll < 0.75) {
          x = 2 + xRoll * 20;
          y = 18 + yRoll * 62;
        } else {
          x = 74 + xRoll * 22;
          y = 18 + yRoll * 62;
        }

        all.push({
          id: `chip-${bucketIdx}-${chipIdx}`,
          label,
          color: bucket.color,
          bucketIdx,
          bucketLabel: bucket.label,
          stage1X: x,
          stage1Y: y,
          delay: (bucketIdx * 4 + chipIdx) * 0.04,
        });
      });
    });
    return all;
  }, [buckets]);

  return (
    <div
      ref={viewRef as React.RefObject<HTMLDivElement>}
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center"
    >
      {/* Heading — crossfades between stages */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-6 py-8 bg-[var(--bg-primary)]/80 backdrop-blur-sm rounded-2xl">
        <motion.h2
          key={stage === 1 ? "h1" : "h2"}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {stage === 1 ? stage1Heading : stage2Heading}
        </motion.h2>
        {stage === 2 && (
          <motion.p
            className="mt-4 text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {stage2Subtitle}
          </motion.p>
        )}
      </div>

      {/* Stage 1: scattered chip cloud (absolutely positioned) */}
      {stage === 1 && (
        <div className="absolute inset-0 pointer-events-none">
          {chips.map((chip) => (
            <motion.span
              key={chip.id}
              layoutId={chip.id}
              className="absolute inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-mono border whitespace-nowrap"
              style={{
                left: `${chip.stage1X}%`,
                top: `${chip.stage1Y}%`,
                borderColor: `${chip.color}40`,
                color: chip.color,
                background: `${chip.color}0f`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                ...(reducedMotion ? {} : { y: [0, -6, 0] }),
              }}
              transition={{
                delay: chip.delay,
                duration: 0.4,
                ...(reducedMotion
                  ? {}
                  : {
                      y: {
                        duration: 6 + ((chip.delay * 10) % 4),
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: chip.delay + 0.4,
                      },
                    }),
              }}
            >
              {chip.label}
            </motion.span>
          ))}
        </div>
      )}

      {/* Stage 2: bucket grid */}
      {stage === 2 && (
        <div className="relative z-0 w-full max-w-6xl mx-auto mt-8 px-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {buckets.map((bucket, bucketIdx) => (
            <motion.div
              key={bucket.label}
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + bucketIdx * 0.05, duration: 0.4 }}
            >
              <div
                className="text-xs md:text-sm font-semibold uppercase tracking-wide pb-1 border-b"
                style={{ color: bucket.color, borderColor: `${bucket.color}40` }}
              >
                {bucket.label}
              </div>
              <div className="flex flex-col gap-1.5">
                {bucket.chips.map((chipLabel, chipIdx) => (
                  <motion.span
                    key={`${bucket.label}-${chipLabel}`}
                    layoutId={`chip-${bucketIdx}-${chipIdx}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-mono border whitespace-nowrap"
                    style={{
                      borderColor: `${bucket.color}60`,
                      color: bucket.color,
                      background: `${bucket.color}14`,
                    }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  >
                    {chipLabel}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
