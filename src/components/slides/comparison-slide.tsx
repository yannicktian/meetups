"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Bullet = string | { text: string; icon?: string };

type Side = {
  label: string;
  title: string;
  bullets: Bullet[];
  icon?: string;
  color?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  left: Side;
  right: Side;
};

function SideCard({
  side,
  index,
  isHighlighted,
}: {
  side: Side;
  index: number;
  isHighlighted: boolean;
}) {
  const Icon = getIcon(side.icon);
  const accentColor = side.color || (isHighlighted ? "var(--accent)" : "var(--text-muted)");

  return (
    <motion.div
      className="flex-1 bg-white rounded-2xl border-2 p-5 md:p-8 shadow-sm w-full"
      style={{
        borderColor: isHighlighted ? accentColor : "var(--border)",
      }}
      initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
      whileInView={{ opacity: isHighlighted ? 1 : 0.85, x: 0 }}
      viewport={VIEWPORT}
      transition={{ delay: 0.3 + index * 0.15 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `${accentColor}1a`,
              color: accentColor,
            }}
          >
            <Icon className="w-6 h-6" strokeWidth={2.25} />
          </div>
        )}
        <span
          className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {side.label}
        </span>
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-4 leading-tight">
        {side.title}
      </h3>
      <ul className="flex flex-col gap-3">
        {side.bullets.map((bullet, i) => {
          const text = typeof bullet === "string" ? bullet : bullet.text;
          const BulletIcon =
            typeof bullet === "string" ? null : getIcon(bullet.icon);
          return (
            <li
              key={i}
              className="text-base md:text-lg lg:text-xl text-[var(--text-secondary)] flex items-start gap-3"
            >
              {BulletIcon ? (
                <div
                  className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    background: `${accentColor}14`,
                    color: accentColor,
                  }}
                >
                  <BulletIcon className="w-4 h-4" strokeWidth={2.25} />
                </div>
              ) : (
                <span className="text-[var(--text-muted)] mt-1.5 flex-shrink-0 w-2 text-center">
                  •
                </span>
              )}
              <span className="flex-1 leading-snug">{text}</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}

export function ComparisonSlide({ title, subtitle, left, right }: Props) {
  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-[var(--text-secondary)] mt-2 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-6 relative">
        <SideCard side={left} index={0} isHighlighted={false} />

        {/* Arrow separator — horizontal on desktop, vertical on mobile */}
        <motion.div
          className="flex items-center justify-center py-1 md:py-0"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.55 }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm"
            style={{
              background: right.color || "var(--accent-soft)",
            }}
          >
            <ArrowRight
              className="w-6 h-6 hidden md:block"
              style={{ color: right.color ? "white" : "var(--accent)" }}
              strokeWidth={2.75}
            />
            <ArrowDown
              className="w-6 h-6 md:hidden"
              style={{ color: right.color ? "white" : "var(--accent)" }}
              strokeWidth={2.75}
            />
          </div>
        </motion.div>

        <SideCard side={right} index={1} isHighlighted={true} />
      </div>
    </div>
  );
}
