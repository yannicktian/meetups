"use client";

import { motion } from "framer-motion";
import { getIcon } from "@/lib/icon-map";

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
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <div className="flex flex-col gap-10 w-full">
      <div className="text-center">
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-[var(--text-primary)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {title}
        </motion.h2>
        {subtitle && (
          <motion.p
            className="text-lg text-[var(--text-secondary)] mt-3 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              className="bg-white rounded-xl border border-[var(--border)] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08 }}
            >
              <div className="flex items-start gap-3">
                {Icon && (
                  <div
                    className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${accentColor}1a`,
                      color: accentColor,
                    }}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2.25} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[var(--text-primary)] text-base md:text-lg leading-tight">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-[var(--text-secondary)] mt-1 leading-relaxed">
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
