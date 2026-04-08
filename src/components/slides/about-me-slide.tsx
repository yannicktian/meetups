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
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16 w-full max-w-5xl mx-auto">
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
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ring-[var(--accent)]/20">
          <Image
            src={avatar}
            alt={name}
            fill
            sizes="(max-width: 640px) 176px, (max-width: 768px) 208px, (max-width: 1024px) 256px, 288px"
            className="object-cover"
            priority
          />
        </div>
      </motion.div>

      {/* Bio */}
      <div className="flex-1 flex flex-col gap-4 w-full text-center md:text-left">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={VIEWPORT}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-tight">
            {name}
          </h2>
          <p className="text-xl md:text-2xl lg:text-3xl text-[var(--text-secondary)] mt-2">
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
          <ul className="flex flex-col gap-3 mt-4 items-center md:items-start">
            {bullets.map((bullet, i) => {
              const isObject = typeof bullet === "object";
              const text = isObject ? bullet.text : bullet;
              const Icon = isObject ? getIcon(bullet.icon) : null;

              return (
                <motion.li
                  key={i}
                  className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] flex items-start gap-3 max-w-md md:max-w-none"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={VIEWPORT}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  {Icon ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-md bg-[var(--accent-soft)] flex items-center justify-center mt-1">
                      <Icon className="w-4 h-4 text-[var(--accent)]" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <span className="text-[var(--accent)] mt-1 font-bold flex-shrink-0">
                      &#9656;
                    </span>
                  )}
                  <span className="flex-1 text-left">{text}</span>
                </motion.li>
              );
            })}
          </ul>
        )}

        {links && links.length > 0 && (
          <motion.div
            className="flex flex-wrap gap-2 md:gap-3 mt-4 justify-center md:justify-start"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.8 }}
          >
            {links.map((link) => (
              <span
                key={link.label}
                className="text-sm md:text-base font-mono text-[var(--text-muted)] px-3 py-1 rounded-full bg-[var(--bg-surface-alt)] border border-[var(--border)]"
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
