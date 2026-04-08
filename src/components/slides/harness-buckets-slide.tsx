"use client";

import { motion } from "framer-motion";
import { useInView } from "@/lib/use-in-view";

type Bucket = {
  label: string;
  color: string;
  chips: string[];
};

type Props = {
  heading: string;
  subheading?: string;
  buckets: Bucket[];
};

/** Gathered bucket-grid slide — the pay-off to the scattered cloud.
 *
 * Each bucket fades in as a column (label + chips), then the chips in each
 * column appear with a small stagger so the grid fills in like a checklist.
 */
export function HarnessBucketsSlide({ heading, subheading, buckets }: Props) {
  const { ref: viewRef, isInView } = useInView(0.3);

  return (
    <div
      ref={viewRef as React.RefObject<HTMLDivElement>}
      className="relative w-full min-h-[70vh] flex flex-col items-center justify-center"
    >
      {/* Title + subtitle */}
      <motion.div
        className="relative z-10 text-center max-w-4xl mx-auto px-6"
        initial={{ opacity: 0, y: -8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight">
          {heading}
        </h2>
        {subheading && (
          <motion.p
            className="mt-4 text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {subheading}
          </motion.p>
        )}
      </motion.div>

      {/* Bucket grid — 4 columns on desktop, last row naturally wraps to 3.
       * Each column is a flex item with a bounded width so chips never
       * overflow their bucket into the next column. */}
      <div className="relative z-0 mt-12 px-6 flex flex-wrap justify-center gap-x-8 gap-y-10 max-w-5xl mx-auto">
        {buckets.map((bucket, bucketIdx) => (
          <motion.div
            key={bucket.label}
            className="flex flex-col gap-2 w-52 min-w-0"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.35 + bucketIdx * 0.06, duration: 0.45 }}
          >
            <div
              className="text-xs md:text-sm font-semibold uppercase tracking-wide pb-1 border-b"
              style={{
                color: bucket.color,
                borderColor: `${bucket.color}40`,
              }}
            >
              {bucket.label}
            </div>
            <div className="flex flex-col gap-1.5 items-start">
              {bucket.chips.map((chipLabel, chipIdx) => (
                <motion.span
                  key={`${bucket.label}-${chipLabel}`}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono border whitespace-nowrap max-w-full"
                  style={{
                    borderColor: `${bucket.color}60`,
                    color: bucket.color,
                    background: `${bucket.color}14`,
                  }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }
                  }
                  transition={{
                    delay: 0.5 + bucketIdx * 0.06 + chipIdx * 0.04,
                    duration: 0.35,
                  }}
                >
                  {chipLabel}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
