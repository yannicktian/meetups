"use client";

import { motion } from "framer-motion";
import { MiniCodeBlock } from "@/components/interactive/mini-code-block";
import { getIcon } from "@/lib/icon-map";

type Bullet = string | { text: string; icon?: string };

type Props = {
  title: string;
  subtitle?: string;
  bullets?: Bullet[];
  children?: React.ReactNode;
  reversed?: boolean;
  code?: string;
  codeLang?: string;
  codeCaption?: string;
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
}: Props) {
  const hasVisual = !!children || !!code;

  return (
    <div
      className={`flex flex-col ${hasVisual ? "md:flex-row" : ""} items-center gap-12 ${reversed ? "md:flex-row-reverse" : ""}`}
    >
      {/* Text side */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] leading-tight"
          initial={{ opacity: 0, x: reversed ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {subtitle}
          </motion.p>
        )}
        {bullets && (
          <motion.ul className="flex flex-col gap-3 mt-3">
            {bullets.map((bullet, i) => {
              const isObject = typeof bullet === "object";
              const text = isObject ? bullet.text : bullet;
              const Icon = isObject ? getIcon(bullet.icon) : null;

              return (
                <motion.li
                  key={i}
                  className="text-base md:text-lg text-[var(--text-secondary)] flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  {Icon ? (
                    <div className="flex-shrink-0 w-6 h-6 rounded-md bg-[var(--accent-soft)] flex items-center justify-center mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[var(--accent)]" strokeWidth={2.5} />
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
          </motion.ul>
        )}
      </div>

      {/* Visual side: children OR code */}
      {hasVisual && (
        <motion.div
          className="flex-1 w-full min-w-0"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
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
