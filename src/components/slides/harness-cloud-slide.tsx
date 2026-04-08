"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { useInView } from "@/lib/use-in-view";

type Bucket = {
  label: string;
  color: string;
  chips: string[];
};

type Props = {
  heading: string;
  buckets: Bucket[];
};

/** Scattered chip cloud slide.
 *
 * On each entry into view, chips burst from the center of the slide out to
 * deterministic edge positions, then gently bob via a CSS keyframe animation
 * on the inner span (so Framer's layout transforms never fight the bob).
 *
 * Mirrors the "And a harness is a lot of things" slide in Mastra's agent
 * harness workshop.
 */
export function HarnessCloudSlide({ heading, buckets }: Props) {
  const { ref: viewRef, isInView } = useInView(0.3);

  type ChipMeta = {
    id: string;
    label: string;
    color: string;
    stage1X: number; // % of container width
    stage1Y: number; // % of container height
    bobDelay: number;
    bobDuration: number;
    enterDelay: number;
  };

  const chips = useMemo<ChipMeta[]>(() => {
    // Deterministic LCG so chip positions are stable across renders.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const all: ChipMeta[] = [];
    let orderIdx = 0;
    buckets.forEach((bucket, bucketIdx) => {
      bucket.chips.forEach((label, chipIdx) => {
        // Mastra-style edge placement: pick either the left/right edges or
        // the top/bottom edges. The center 25%–75% band stays clear so the
        // title never overlaps a chip.
        const which = rand();
        const sidePick = rand();
        const along = rand();

        let x: number;
        let y: number;
        if (which < 0.5) {
          // Left or right edge band
          x = sidePick < 0.5 ? 3 + along * 22 : 75 + along * 22;
          y = 6 + rand() * 84;
        } else {
          // Top or bottom edge band
          x = 4 + along * 88;
          y = sidePick < 0.5 ? 4 + rand() * 18 : 78 + rand() * 18;
        }

        all.push({
          id: `cloud-chip-${bucketIdx}-${chipIdx}`,
          label,
          color: bucket.color,
          stage1X: x,
          stage1Y: y,
          bobDelay: rand() * 4,
          bobDuration: 6 + rand() * 4,
          enterDelay: orderIdx * 0.025,
        });
        orderIdx += 1;
      });
    });
    return all;
  }, [buckets]);

  return (
    <div
      ref={viewRef as React.RefObject<HTMLDivElement>}
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center"
    >
      {/* Chip cloud — absolutely positioned layer behind the title */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {chips.map((chip) => (
          <motion.div
            key={chip.id}
            className="absolute"
            initial={{
              left: "50%",
              top: "50%",
              x: "-50%",
              y: "-50%",
              opacity: 0,
              scale: 0.3,
            }}
            animate={
              isInView
                ? {
                    left: `${chip.stage1X}%`,
                    top: `${chip.stage1Y}%`,
                    x: "-50%",
                    y: "-50%",
                    opacity: 1,
                    scale: 1,
                  }
                : {
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                    opacity: 0,
                    scale: 0.3,
                  }
            }
            transition={{
              delay: isInView ? chip.enterDelay : 0,
              duration: 0.85,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <span
              className="chip-bob inline-flex items-center px-2.5 py-1 rounded-full text-xs md:text-sm font-mono border whitespace-nowrap"
              style={{
                borderColor: `${chip.color}55`,
                color: chip.color,
                // Solid slide bg so overlapping chips cleanly occlude each
                // other instead of blending into an unreadable stack.
                background: "var(--bg-primary)",
                animationDelay: `${chip.bobDelay}s`,
                animationDuration: `${chip.bobDuration}s`,
              }}
            >
              {chip.label}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Title — sits in front of the cloud, no card */}
      <motion.div
        className="relative z-10 inline-block text-center px-8 md:px-12 py-6 md:py-8"
        initial={{ opacity: 0, y: -8 }}
        animate={
          isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }
        }
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight max-w-3xl">
          {heading}
        </h2>
      </motion.div>
    </div>
  );
}
