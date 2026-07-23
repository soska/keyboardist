import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import KeyupDemo from "@/demos/keyup-demo";
import keyupDemoSource from "@/demos/keyup-demo.tsx?raw";

export function OtherEventsSection() {
  return (
    <>
      <P>
        By default the listener listens to <InlineCode>keydown</InlineCode>{" "}
        events, but you can pass <InlineCode>keyup</InlineCode> to use that
        event instead:
      </P>
      <CodeBlock
        lang="typescript"
        code={`import { createListener } from "keyboardist";

const downListener = createListener();
const upListener = createListener("keyup");

downListener.subscribe("KeyA", () => {
  console.log("Just pressed the A key");
});

upListener.subscribe("KeyA", () => {
  console.log("Just released the A key");
});`}
      />
      <DemoBlock source={keyupDemoSource} fileName="keyup-demo.tsx">
        <KeyupDemo />
      </DemoBlock>
    </>
  );
}
