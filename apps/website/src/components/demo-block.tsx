import type { ReactNode } from "react";
import { CodeBlock } from "@/components/code/code-block";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs } from "@/components/ui/tabs";

/**
 * A live demo with its real source next to it. `source` is the `?raw`
 * import of the same file that renders `children`, so the code shown is
 * always the code running.
 */
export function DemoBlock({
  source,
  fileName,
  children,
}: {
  source: string;
  fileName: string;
  children: ReactNode;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
      <Tabs
        actions={
          <>
            <span className="font-mono text-xs text-zinc-400">{fileName}</span>
            <CopyButton text={source} />
          </>
        }
        items={[
          {
            id: "preview",
            label: "Preview",
            content: <div className="p-6">{children}</div>,
          },
          {
            id: "code",
            label: "Code",
            content: <CodeBlock code={source} lang="tsx" />,
          },
        ]}
      />
    </div>
  );
}
