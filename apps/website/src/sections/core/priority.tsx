import { Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code/code-block";
import { InlineCode, P } from "@/components/prose";

export function PrioritySection() {
  return (
    <>
      <P>
        When push order can't express who should win — for example when a
        framework schedules your pushes in an order you don't control — give
        layers a <InlineCode>priority</InlineCode> (default{" "}
        <InlineCode>0</InlineCode>). Higher-priority layers always sit above
        lower-priority ones regardless of push order; within the same priority,
        the latest push is on top, exactly like before:
      </P>
      <CodeBlock
        lang="typescript"
        code={`kb.layer("layout", { escape: closeSidebar }, { priority: 1 });
kb.layer("modal", { escape: closeModal }, { priority: 3 });

// no matter which order these get pushed in, modal beats layout`}
      />
      <P>
        (If you use{" "}
        <Link
          to="/react"
          className="text-zinc-900 underline dark:text-zinc-100"
        >
          keyboardist/react
        </Link>
        , priority is derived from the component tree automatically — you
        shouldn't need to set it by hand.)
      </P>
      <P>
        Inspect the stack at runtime with{" "}
        <InlineCode>kb.activeLayers()</InlineCode> (names, top to bottom, ending
        in <InlineCode>"base"</InlineCode>) and{" "}
        <InlineCode>kb.getBindings()</InlineCode> (every binding with its layer
        and active state).
      </P>
    </>
  );
}
