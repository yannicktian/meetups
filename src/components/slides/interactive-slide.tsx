"use client";

import { motion } from "framer-motion";
import { SmsConversation } from "@/components/interactive/sms-conversation";
import { PrerequisiteSetup } from "@/components/interactive/prerequisite-setup";
import type { ComponentType } from "react";

const VIEWPORT = { once: false, amount: 0.3 } as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const interactiveRegistry: Record<string, ComponentType<any>> = {
  SmsConversation,
  PrerequisiteSetup,
};

type Props = {
  title?: string;
  subtitle?: string;
  interactiveComponent: string;
  interactiveProps: Record<string, unknown>;
  layout?: "centered" | "side-by-side";
};

export function InteractiveSlide({
  title,
  subtitle,
  interactiveComponent,
  interactiveProps,
  layout = "centered",
}: Props) {
  const Component = interactiveRegistry[interactiveComponent];

  return (
    <div className={`flex flex-col gap-6 md:gap-8 w-full ${layout === "centered" ? "items-center" : ""}`}>
      {(title || subtitle) && (
        <div className={layout === "centered" ? "text-center" : ""}>
          {title && (
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-[var(--text-primary)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mt-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      )}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.3 }}
      >
        {Component ? (
          <Component {...interactiveProps} />
        ) : (
          <p className="text-red-500 text-center">
            Unknown interactive: {interactiveComponent}
          </p>
        )}
      </motion.div>
    </div>
  );
}
