"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type CalloutKind = "insight" | "warning" | "success" | "info";

type Props = {
  title?: string;
  subtitle?: string;
  callout: string;
  calloutHref?: string;
  attribution?: string;
  icon?: string;
  kind?: CalloutKind;
};

const KIND_STYLES: Record<CalloutKind, { bg: string; border: string; iconColor: string }> = {
  insight: { bg: "#f5f3ff", border: "#8b5cf6", iconColor: "#7c3aed" },
  warning: { bg: "#fffbeb", border: "#f59e0b", iconColor: "#d97706" },
  success: { bg: "#ecfdf5", border: "#10b981", iconColor: "#059669" },
  info: { bg: "#eef2ff", border: "#6366f1", iconColor: "#4f46e5" },
};

export function CalloutSlide({
  title,
  subtitle,
  callout,
  calloutHref,
  attribution,
  icon = "Lightbulb",
  kind = "insight",
}: Props) {
  const Icon = getIcon(icon);
  const style = KIND_STYLES[kind];

  return (
    <div className="flex flex-col items-center justify-center gap-6 md:gap-8 max-w-4xl mx-auto text-center">
      {title && (
        <motion.h2
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
      )}
      {subtitle && (
        <motion.p
          className="text-xl md:text-2xl text-[var(--text-secondary)] -mt-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.1 }}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        className="relative w-full rounded-2xl p-8 md:p-12 border-2 shadow-lg"
        style={{
          background: style.bg,
          borderColor: style.border,
        }}
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {Icon && (
          <div
            className="absolute -top-7 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center shadow-md border-2"
            style={{
              background: "white",
              borderColor: style.border,
              color: style.iconColor,
            }}
          >
            <Icon className="w-7 h-7" strokeWidth={2.5} />
          </div>
        )}

        <p className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text-primary)] mt-2">
          {calloutHref ? (
            <a
              href={calloutHref}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-2 underline-offset-4 hover:opacity-80 transition-opacity"
              style={{ textDecorationColor: style.iconColor }}
            >
              {callout}
            </a>
          ) : (
            callout
          )}
        </p>

        {attribution && (
          <p
            className="mt-5 text-base md:text-lg font-mono uppercase tracking-wider"
            style={{ color: style.iconColor }}
          >
            — {attribution}
          </p>
        )}
      </motion.div>
    </div>
  );
}
