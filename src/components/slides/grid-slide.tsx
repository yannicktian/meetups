"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type GridItem = {
  icon?: string;
  title: string;
  description?: string;
  color?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  items: GridItem[];
  columns?: 2 | 3;
};

export function GridSlide({ title, subtitle, items, columns = 3 }: Props) {
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="flex flex-col gap-6 md:gap-10 w-full">
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
            className="text-lg md:text-xl lg:text-2xl text-[var(--text-secondary)] mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
            transition={{ delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      <div className={`grid grid-cols-1 ${gridCols} gap-4 md:gap-5`}>
        {items.map((item, i) => {
          const Icon = getIcon(item.icon);
          const accentColor = item.color || "var(--accent)";

          return (
            <motion.div
              key={item.title}
              className="bg-white rounded-xl border border-[var(--border)] p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div className="flex items-start gap-4">
                {Icon && (
                  <div
                    className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${accentColor}1a`,
                      color: accentColor,
                    }}
                  >
                    <Icon className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.25} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text-primary)] text-xl md:text-2xl leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-base md:text-lg text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
