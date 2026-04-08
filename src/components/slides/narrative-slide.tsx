"use client";

import { motion } from "framer-motion";
import { MiniCodeBlock } from "@/components/interactive/mini-code-block";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Bullet = string | { text: string; icon?: string; highlight?: boolean };

type Size = "default" | "large";

type Props = {
  title: string;
  subtitle?: string;
  bullets?: Bullet[];
  children?: React.ReactNode;
  reversed?: boolean;
  code?: string;
  codeLang?: string;
  codeCaption?: string;
  size?: Size;
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
  size = "default",
}: Props) {
  const hasVisual = !!children || !!code;
  const isLarge = size === "large";

  const titleClass = isLarge
    ? "text-4xl md:text-6xl lg:text-7xl font-bold text-[var(--text-primary)] leading-tight"
    : "text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight";

  const subtitleClass = isLarge
    ? "text-2xl md:text-3xl text-[var(--text-secondary)] font-light"
    : "text-lg md:text-xl text-[var(--text-secondary)]";

  const bulletTextClass = isLarge
    ? "text-xl md:text-2xl text-[var(--text-secondary)]"
    : "text-base md:text-lg text-[var(--text-secondary)]";

  const iconBoxClass = isLarge
    ? "flex-shrink-0 w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center mt-0.5"
    : "flex-shrink-0 w-6 h-6 rounded-md bg-[var(--accent-soft)] flex items-center justify-center mt-0.5";

  const iconClass = isLarge ? "w-5 h-5 text-[var(--accent)]" : "w-3.5 h-3.5 text-[var(--accent)]";

  return (
    <div
      className={`flex flex-col ${hasVisual ? "md:flex-row" : ""} items-center gap-12 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      {/* Text side */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <motion.h2
          className={titleClass}
          initial={{ opacity: 0, x: reversed ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
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
        {bullets && (
          <ul className={`flex flex-col ${isLarge ? "gap-5" : "gap-3"} mt-3`}>
            {bullets.map((bullet, i) => {
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
                    transition={{ delay: 0.4 + i * 0.08 }}
                  >
                    <div
                      className={`relative rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-br from-[var(--accent-soft)] to-white p-5 md:p-6 shadow-md`}
                    >
                      <div className="flex items-start gap-4">
                        {Icon && (
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)] flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-white" strokeWidth={2.75} />
                          </div>
                        )}
                        <span
                          className={`flex-1 font-bold text-[var(--text-primary)] ${
                            isLarge ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
                          } leading-snug`}
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
                  className={`${bulletTextClass} flex items-start gap-3`}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ delay: 0.4 + i * 0.08 }}
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
      </div>

      {/* Visual side: children OR code */}
      {hasVisual && (
        <motion.div
          className="flex-1 w-full min-w-0"
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
