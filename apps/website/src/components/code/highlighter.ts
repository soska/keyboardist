import type { HighlighterCore } from "shiki/core";

// Lazily-created shiki singleton. The fine-grained core plus only the
// grammars/theme we use keeps the highlighter in its own async chunk that
// never blocks first paint — CodeBlock renders plain <pre> until it lands.
let highlighterPromise: Promise<HighlighterCore> | null = null;

export function getHighlighter(): Promise<HighlighterCore> {
  highlighterPromise ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] =
      await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
      ]);
    return createHighlighterCore({
      themes: [import("shiki/themes/github-dark.mjs")],
      langs: [
        import("shiki/langs/tsx.mjs"),
        import("shiki/langs/typescript.mjs"),
        import("shiki/langs/bash.mjs"),
      ],
      engine: createJavaScriptRegexEngine(),
    });
  })();
  return highlighterPromise;
}
