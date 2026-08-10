import { useEffect, useState } from "react";
import { getHighlighter } from "./highlighter";

export type CodeLang = "tsx" | "typescript" | "bash";

export function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string;
  lang?: CodeLang;
}) {
  const trimmed = code.replace(/\n+$/, "");
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((highlighter) => {
      if (!cancelled) {
        setHtml(
          highlighter.codeToHtml(trimmed, { lang, theme: "github-dark" }),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [trimmed, lang]);

  if (html) {
    return (
      <div
        className="code-block font-mono"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki output from our own source strings
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="code-block font-mono">
      <pre>
        <code>{trimmed}</code>
      </pre>
    </div>
  );
}
