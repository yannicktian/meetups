"use client";

import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";

type Props = {
  code: string;
  lang?: string;
  caption?: string;
};

export function MiniCodeBlock({ code, lang = "typescript", caption }: Props) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    codeToHtml(code, {
      lang,
      theme: "github-light",
    }).then(setHtml);
  }, [code, lang]);

  return (
    <div className="flex flex-col gap-2 w-full">
      {caption && (
        <span className="text-xs md:text-sm font-mono text-[var(--text-muted)] uppercase tracking-wider">
          {caption}
        </span>
      )}
      <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white shadow-sm">
        {html ? (
          <div
            className="text-sm md:text-base leading-relaxed [&_pre]:!p-4 md:[&_pre]:!p-5 [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="p-4 text-[var(--text-muted)] text-sm">{code}</pre>
        )}
      </div>
    </div>
  );
}
