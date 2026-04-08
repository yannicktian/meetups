"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Bullet = string | { text: string; icon?: string };

type Props = {
  name: string;
  role: string;
  company?: string;
  avatar: string;
  bullets?: Bullet[];
  links?: { label: string; href?: string }[];
};

export function AboutMeSlide({ name, role, company, avatar, bullets, links }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 w-full max-w-5xl mx-auto">
      {/* Avatar */}
      <motion.div
        className="flex-shrink-0 relative"
        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-30"
          style={{
            background: "linear-gradient(135deg, var(--gradient-start), var(--gradient-end))",
          }}
        />
        <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[var(--accent)]/20">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="(max-width: 768px) 224px, 288px"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Bio */}
      <div className="flex-1 flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] leading-tight">
            {name}
          </h2>
          <p className="text-xl md:text-2xl text-[var(--text-secondary)] mt-1">
            {role}
            {company && (
              <>
                {" "}
                <span className="text-[var(--accent)] font-bold">@ {company}</span>
              </>
            )}
          </p>
        </motion.div>

        {bullets && bullets.length > 0 && (
          <ul className="flex flex-col gap-3 mt-4">
            {bullets.map((bullet, i) => {
              const isObject = typeof bullet === "object";
              const text = isObject ? bullet.text : bullet;
              const Icon = isObject ? getIcon(bullet.icon) : null;

              return (
                <motion.li
                  key={i}
                  className="text-base md:text-lg text-[var(--text-secondary)] flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {Icon ? (
                    <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[var(--accent-soft)] flex items-center justify-center mt-0.5">
                      <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={2.5} />
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

        {links && links.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-3 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.8 }}
          >
            {links.map((link) => (
              <span
                key={link.label}
                className="text-sm font-mono text-[var(--text-muted)] px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border)]"
              >
                {link.label}
              </span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
