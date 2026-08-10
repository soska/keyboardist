import { CodeBlock } from "@/components/code/code-block";
import { InlineCode, P } from "@/components/prose";

export function StopListeningSection() {
  return (
    <>
      <P>
        Internally each listener attaches a single event handler to the target
        element. <InlineCode>stopListening</InlineCode> removes it;{" "}
        <InlineCode>startListening</InlineCode> re-attaches it.
      </P>
      <CodeBlock
        lang="typescript"
        code={`const listener = createListener();

listener.subscribe("KeyA", () => {
  console.log("Just pressed the A key");
});

// Remove the event listener from the document
listener.stopListening();

// Reattach it again:
listener.startListening();`}
      />
    </>
  );
}
