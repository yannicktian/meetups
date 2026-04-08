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
        <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider">
          {caption}
        </span>
      )}
      <div className="rounded-xl overflow-hidden border border-[var(--border)] bg-white shadow-sm">
        {html ? (
          <div
            className="text-[11px] md:text-xs leading-relaxed [&_pre]:!p-4 [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <pre className="p-4 text-[var(--text-muted)] text-xs">{code}</pre>
        )}
      </div>
    </div>
  );
}
