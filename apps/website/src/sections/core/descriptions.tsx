import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { Callout, InlineCode, P } from "@/components/prose";
import DescriptionsDemo from "@/demos/descriptions-demo";
import descriptionsDemoSource from "@/demos/descriptions-demo.tsx?raw";

export function DescriptionsSection() {
  return (
    <>
      <P>
        Bindings can carry a description, so your app can build its own shortcut
        sheet from the bindings that are actually live — no second list to keep
        in sync. Pass an options object as the third argument, or a bare string
        as shorthand.
      </P>
      <CodeBlock
        lang="typescript"
        code={`listener.subscribe(
  "Down",
  () => {
    moveDown();
  },
  { description: "Moves down one item" },
);

// a bare string is shorthand for { description }
listener.subscribe("Up", moveUp, "Moves up one item");`}
      />
      <P>
        Read them back with <InlineCode>getBindings()</InlineCode>, which now
        returns the description alongside the layer, key, and active state:
      </P>
      <CodeBlock
        lang="typescript"
        code={`listener.getBindings();
// [
//   { layer: "base", key: "down", active: true, priority: 0,
//     description: "Moves down one item" },
//   { layer: "base", key: "up",   active: true, priority: 0,
//     description: "Moves up one item" },
// ]`}
      />
      <P>
        In a bindings map, swap the callback for an object to describe it. Bare
        callbacks keep working, and the two forms mix freely:
      </P>
      <CodeBlock
        lang="typescript"
        code={`listener.layer("editor", {
  KeyS: { handler: save, description: "Saves the document" },
  KeyZ: undo, // undocumented, still bound
});`}
      />
      <P>
        The listing is grouped by layer rather than flattened by key — the same
        key can be bound on several layers at once, which is the whole point of
        layers. Filter on <InlineCode>active</InlineCode> to show only what's
        reachable right now. Pass <InlineCode>hidden: true</InlineCode> for
        bindings you don't want on the sheet; they stay fully functional, which
        is what you want for the shortcut that opens the sheet itself.
      </P>
      <Callout>
        Key names come from <InlineCode>event.code</InlineCode>, so{" "}
        <InlineCode>?</InlineCode> is <InlineCode>"shift+slash"</InlineCode> on
        a US layout — subscribing to the literal <InlineCode>"?"</InlineCode>{" "}
        will never match. On layouts where <InlineCode>?</InlineCode> sits
        elsewhere, pick the binding that suits your users.
      </Callout>
      <DemoBlock
        source={descriptionsDemoSource}
        fileName="descriptions-demo.tsx"
      >
        <DescriptionsDemo />
      </DemoBlock>
    </>
  );
}
