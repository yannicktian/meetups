"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import type { CodeStep } from "@/lib/types";

const VIEWPORT = { once: false, amount: 0.3 } as const;

type Props = {
  title?: string;
  code: string;
  lang?: string;
  steps?: CodeStep[];
};

export function CodeSlide({ title, code, lang = "typescript", steps }: Props) {
  const [html, setHtml] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-light",
    }).then(setHtml);
  }, [code, lang]);

  // Keyboard step navigation within the code slide
  useEffect(() => {
    if (!steps || steps.length === 0) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        e.stopPropagation();
        setActiveStep((prev) => Math.min(steps!.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        e.stopPropagation();
        setActiveStep((prev) => Math.max(0, prev - 1));
      }
    }

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [steps]);

  const currentStep = steps?.[activeStep];

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        {title && (
          <motion.h2
            className="text-2xl md:text-3xl font-bold"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={VIEWPORT}
          >
            {title}
          </motion.h2>
        )}
        {currentStep?.annotation && (
          <motion.span
            key={activeStep}
            className="text-sm text-[var(--accent-bright)] font-mono"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {currentStep.annotation}
          </motion.span>
        )}
      </div>

      <motion.div
        className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-white shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ delay: 0.2 }}
      >
        {/* Step indicators */}
        {steps && steps.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1.5 z-10">
            {steps.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === activeStep ? "bg-[var(--accent)]" : "bg-[var(--text-muted)]"
                }`}
                onClick={() => setActiveStep(i)}
              />
            ))}
          </div>
        )}

        {/* Code with line dimming via CSS */}
        {html ? (
          <div
            className="text-sm md:text-base [&_pre]:!p-6 [&_pre]:!bg-transparent [&_.line]:transition-opacity [&_.line]:duration-300 code-slide-container"
            data-active-start={currentStep?.range[0]}
            data-active-end={currentStep?.range[1]}
            dangerouslySetInnerHTML={{ __html: highlightLines(html, currentStep) }}
          />
        ) : (
          <pre className="p-6 text-[var(--text-muted)] text-sm">{code}</pre>
        )}
      </motion.div>
    </div>
  );
}

// Post-process Shiki HTML to apply opacity to lines outside the active range
function highlightLines(html: string, step: CodeStep | undefined): string {
  if (!step) return html;
  const [start, end] = step.range;
  let lineNum = 0;
  return html.replace(/<span class="line"/g, () => {
    lineNum++;
    const inRange = lineNum >= start && lineNum <= end;
    const opacity = inRange ? "1" : "0.25";
    return `<span class="line" style="opacity:${opacity}"`;
  });
}
