import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import MultipleListenersDemo from "@/demos/multiple-listeners-demo";
import multipleListenersDemoSource from "@/demos/multiple-listeners-demo.tsx?raw";

export function MultipleListenersSection() {
  return (
    <>
      <P>
        You can add multiple listeners for the same key. They run starting from
        the last one subscribed, and returning <InlineCode>false</InlineCode>{" "}
        from a callback stops the earlier ones from running.
      </P>
      <CodeBlock
        lang="typescript"
        code={`listener.subscribe("Space", () => {
  console.log("A");
});

listener.subscribe("Space", () => {
  console.log("B");
});

listener.subscribe("Space", () => {
  console.log("C");
});

// the console will log 'C', then 'B', then 'A' when the spacebar is pressed.`}
      />
      <DemoBlock
        source={multipleListenersDemoSource}
        fileName="multiple-listeners-demo.tsx"
      >
        <MultipleListenersDemo />
      </DemoBlock>
    </>
  );
}
