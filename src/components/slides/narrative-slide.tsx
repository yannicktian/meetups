"use client";

import { motion } from "framer-motion";
import { startTransition, useEffect, useState } from "react";
import { MiniCodeBlock } from "@/components/interactive/mini-code-block";
import { getIcon } from "@/lib/icon-map";
import { useStageNav } from "@/lib/stage-nav-context";
import { useInView } from "@/lib/use-in-view";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Bullet = string | { text: string; icon?: string; highlight?: boolean };

type Size = "default" | "large";

type TagsVariant = "muted" | "accent";

type Props = {
  title: string;
  subtitle?: string;
  bullets?: Bullet[];
  children?: React.ReactNode;
  reversed?: boolean;
  code?: string;
  codeLang?: string;
  codeCaption?: string;
  /** When true (and code is present), give the code pane more horizontal
   * space (roughly 60/40) at md+ breakpoints so longer lines fit without
   * horizontal scrolling. Use for code-centric slides. */
  codeWide?: boolean;
  size?: Size;
  tags?: string[];
  tagsVariant?: TagsVariant;
  /** When true, only the first bullet is shown on mount; right-arrow
   * reveals the next one (via the deck's stage-nav mechanism). Requires
   * `slideId` to be provided by the deck for handler registration. */
  stagedReveal?: boolean;
  /** Injected by the deck so slides can self-register with stage nav. */
  slideId?: string;
};

export function NarrativeSlide({
  title,
  subtitle,
  bullets,
  children,
  reversed,
  code,
  codeLang,
  codeCaption,
  codeWide,
  size = "default",
  tags,
  tagsVariant = "muted",
  stagedReveal,
  slideId,
}: Props) {
  // ─── Staged reveal state ────────────────────────────────────────
  const bulletCount = bullets?.length ?? 0;
  const [visibleCount, setVisibleCount] = useState<number>(
    stagedReveal ? Math.min(1, bulletCount) : bulletCount,
  );
  const stageNav = useStageNav();
  const { ref: viewRef, isInView } = useInView(0.3);

  // Reset to the first bullet when the slide leaves the viewport so the
  // reveal re-fires next time it's shown.
  useEffect(() => {
    if (stagedReveal && !isInView) {
      startTransition(() => setVisibleCount(Math.min(1, bulletCount)));
    }
  }, [stagedReveal, isInView, bulletCount]);

  // Register stage interceptors so right/left arrows reveal bullets
  // one by one before the deck advances to the next slide. Reverse
  // symmetry supported.
  useEffect(() => {
    if (!stagedReveal || !stageNav || !slideId || bulletCount === 0) return;
    stageNav.register(slideId, {
      onNextRequest: () => {
        if (visibleCount < bulletCount) {
          setVisibleCount(visibleCount + 1);
          return true; // consumed
        }
        return false; // let the deck advance to the next slide
      },
      onPrevRequest: () => {
        if (visibleCount > 1) {
          setVisibleCount(visibleCount - 1);
          return true;
        }
        return false;
      },
    });
    return () => stageNav.unregister(slideId);
  }, [visibleCount, stageNav, slideId, stagedReveal, bulletCount]);

  // When staged, only render the first N bullets; otherwise render all.
  const visibleBullets =
    stagedReveal && bullets ? bullets.slice(0, visibleCount) : bullets;

  const hasVisual = !!children || !!code;
  const isLarge = size === "large";

  const titleClass = isLarge
    ? "text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight"
    : "text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] leading-tight";

  // Subtitle and bullets share one size scale now — only title scales with `size`.
  // Accent color + left bar distinguishes the subtitle from bullet text.
  const subtitleClass =
    "text-lg md:text-xl lg:text-2xl text-[var(--accent)] font-semibold tracking-tight border-l-[3px] border-[var(--accent)] pl-4 md:pl-5";

  const bulletTextClass = "text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)]";

  const iconBoxClass = isLarge
    ? "flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mt-0.5"
    : "flex-shrink-0 w-8 h-8 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mt-0.5";

  const iconClass = isLarge
    ? "w-5 h-5 text-[var(--accent)]"
    : "w-4 h-4 text-[var(--accent)]";

  // In staged mode, newly revealed bullets should pop in quickly rather
  // than wait for the full title-first stagger.
  const bulletDelay = (i: number) =>
    stagedReveal ? 0.1 : 0.4 + i * 0.08;

  return (
    <div
      ref={viewRef as React.RefObject<HTMLDivElement>}
      className={`flex flex-col ${hasVisual ? "md:flex-row" : ""} items-center gap-6 md:gap-10 lg:gap-12 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      {/* Text side */}
      <div
        className={`flex-1 ${codeWide ? "md:flex-[0.7]" : ""} flex flex-col gap-4 min-w-0 w-full`}
      >
        {title && (
          <motion.h2
            className={titleClass}
            initial={{ opacity: 0, x: reversed ? 20 : -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.2 }}
          >
            {title}
          </motion.h2>
        )}
        {subtitle && (
          <motion.p
            className={subtitleClass}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
        {visibleBullets && visibleBullets.length > 0 && (
          <ul className={`flex flex-col ${isLarge ? "gap-5" : "gap-4"} mt-3`}>
            {visibleBullets.map((bullet, i) => {
              const isObject = typeof bullet === "object";
              const text = isObject ? bullet.text : bullet;
              const Icon = isObject ? getIcon(bullet.icon) : null;
              const highlight = isObject && bullet.highlight;

              if (highlight) {
                return (
                  <motion.li
                    key={i}
                    className="relative mt-2"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={VIEWPORT}
                    transition={{ delay: bulletDelay(i) }}
                  >
                    <div
                      className={`relative rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent-soft)] to-white p-5 md:p-6 shadow-md`}
                    >
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[var(--accent)] flex items-center justify-center shadow-sm">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" strokeWidth={2.75} />
                          </div>
                        )}
                        <span
                          className="flex-1 font-bold text-[var(--text-primary)] text-xl md:text-2xl lg:text-3xl leading-snug"
                        >
                          {text}
                        </span>
                      </div>
                    </div>
                  </motion.li>
                );
              }

              return (
                <motion.li
                  key={i}
                  className={`${bulletTextClass} flex items-start gap-3 md:gap-4`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ delay: bulletDelay(i) }}
                >
                  {Icon ? (
                    <div className={iconBoxClass}>
                      <Icon className={iconClass} strokeWidth={2.5} />
                    </div>
                  ) : (
                    <span className="text-[var(--accent)] mt-1 font-bold flex-shrink-0">
                      &#9656;
                    </span>
                  )}
                  <span className="flex-1">{text}</span>
                </motion.li>
              );
            })}
          </ul>
        )}
        {tags && tags.length > 0 && (
          <motion.div
            className={`flex flex-wrap gap-2 mt-5 ${
              tagsVariant === "accent" ? "gap-3" : ""
            }`}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.5 }}
          >
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                className={
                  tagsVariant === "accent"
                    ? "inline-flex items-center px-3 py-1.5 rounded-full border border-[var(--accent)] bg-[var(--accent-soft)] text-sm md:text-base font-medium text-[var(--accent)]"
                    : "inline-flex items-center px-2.5 py-1 rounded-md bg-[var(--bg-surface-alt)] text-xs md:text-sm text-[var(--text-muted)] font-mono"
                }
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={VIEWPORT}
                transition={{ delay: 0.55 + i * 0.04, duration: 0.3 }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Visual side: children OR code */}
      {hasVisual && (
        <motion.div
          className={`flex-1 ${codeWide ? "md:flex-[1.3]" : ""} w-full min-w-0`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {children}
          {code && !children && (
            <MiniCodeBlock code={code} lang={codeLang} caption={codeCaption} />
          )}
        </motion.div>
      )}
    </div>
  );
}
