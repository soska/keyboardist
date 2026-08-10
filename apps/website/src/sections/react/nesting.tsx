import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import NestingDemo from "@/demos/nesting-demo";
import nestingDemoSource from "@/demos/nesting-demo.tsx?raw";

export function NestingSection() {
  return (
    <>
      <P>
        When layers overlap on the same key,{" "}
        <strong>the innermost component wins</strong> — the JSX nesting is the
        priority:
      </P>
      <CodeBlock
        code={`<DashboardLayout>            {/* KeyboardLayer: escape → close sidebar */}
  <Posts>                    {/* KeyboardLayer: escape → clear selection */}
    <EditPostModal />        {/* KeyboardLayer: escape → close modal ← wins */}
  </Posts>
</DashboardLayout>`}
      />
      <P>
        This holds even when the whole tree mounts in a single commit (React
        runs effects child-first, so without this the <em>outermost</em> layer
        would land on top of the stack). Priority is derived from{" "}
        <InlineCode>&lt;KeyboardLayer&gt;</InlineCode> nesting via context, so
        it flows through portals too: a <InlineCode>createPortal</InlineCode>{" "}
        modal keeps the priority of its place in the JSX tree, not the DOM.
        Hook-only users can add a nesting level with{" "}
        <InlineCode>&lt;KeyboardScope&gt;</InlineCode>, and an explicit{" "}
        <InlineCode>priority</InlineCode> prop/option overrides the derived
        depth.
      </P>
      <DemoBlock source={nestingDemoSource} fileName="nesting-demo.tsx">
        <NestingDemo />
      </DemoBlock>
    </>
  );
}
