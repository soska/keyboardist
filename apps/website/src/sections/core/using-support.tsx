import { CodeBlock } from "@/components/code/code-block";
import { InlineCode, P } from "@/components/prose";

export function UsingSupportSection() {
  return (
    <>
      <P>
        Subscriptions and layer push-handles implement{" "}
        <InlineCode>[Symbol.dispose]</InlineCode>, so they work with explicit
        resource management:
      </P>
      <CodeBlock
        lang="typescript"
        code={`{
  using sub = kb.subscribe("slash", focusSearch);
  using modalSession = modal.push();
  // ...
} // automatically unsubscribed and popped here`}
      />
    </>
  );
}
