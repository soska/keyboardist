import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import LayersDemo from "@/demos/layers-demo";
import layersDemoSource from "@/demos/layers-demo.tsx?raw";

export function LayersSection() {
  return (
    <>
      <P>
        Bindings can live on named <strong>layers</strong> that stack. The
        topmost layer with a binding for a key wins and shadows the layers below
        it; keys that don't match fall through. This is how you give a modal its
        own keyboard without tearing down the rest of the app:
      </P>
      <CodeBlock
        lang="typescript"
        code={`const kb = createListener();

// base bindings — always at the bottom of the stack
kb.subscribe("slash", focusSearch);

// a named layer with map registration; commas bind aliases
const player = kb.layer("player", {
  space: togglePlay,
  "j,k": step,
  "shift+up": volumeUp,
});
player.push(); // player bindings are now live

// an exclusive layer: unmatched keys go inert instead of falling through,
// so every player shortcut is disabled while the modal is open
const modal = kb.layer("modal", { escape: closeModal }, { exclusive: true });

const pop = modal.push(); // modal now owns the keyboard
// ...when the modal closes:
pop(); // player (and base) bindings are live again`}
      />
      <P>
        Popping is order-independent: if two modals overlap, popping the lower
        one leaves the upper one exactly where it is. Re-pushing an active layer
        moves it to the top. Layers also have{" "}
        <InlineCode>subscribe(key, fn)</InlineCode>,{" "}
        <InlineCode>bind(map)</InlineCode> (returns one subscription for the
        whole map), <InlineCode>pop()</InlineCode>,{" "}
        <InlineCode>isActive()</InlineCode>, and{" "}
        <InlineCode>dispose()</InlineCode>.
      </P>
      <DemoBlock source={layersDemoSource} fileName="layers-demo.tsx">
        <LayersDemo />
      </DemoBlock>
    </>
  );
}
