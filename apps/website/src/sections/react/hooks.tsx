import { DemoBlock } from "@/components/demo-block";
import { A, InlineCode, P, Ul } from "@/components/prose";
import UseKeyBindingsDemo from "@/demos/use-key-bindings-demo";
import useKeyBindingsDemoSource from "@/demos/use-key-bindings-demo.tsx?raw";

export function HooksSection() {
  return (
    <>
      <Ul>
        <li>
          <InlineCode>useKeyBindings(map)</InlineCode> — global bindings for the
          component's lifetime. Inline objects are fine: callbacks are read
          through refs, and resubscription only happens when the set of keys
          changes.
        </li>
        <li>
          <InlineCode>
            useKeyboardLayer(map, {"{ exclusive, active, priority, name }"})
          </InlineCode>{" "}
          — a <A href="/core#layers">layer</A> scoped to the component: created
          on mount, pushed while <InlineCode>active</InlineCode> (default{" "}
          <InlineCode>true</InlineCode>), disposed on unmount. Returns a handle
          with <InlineCode>isActive()</InlineCode>,{" "}
          <InlineCode>push()</InlineCode>, <InlineCode>pop()</InlineCode>.
        </li>
        <li>
          <InlineCode>useKeyMonitor(fn)</InlineCode> — observes every key event
          with the structured <A href="/core#monitor">monitor</A> payload (one
          monitor slot per listener; last mounted wins).
        </li>
        <li>
          <InlineCode>useElementKeyBindings(ref, map)</InlineCode> — a dedicated
          listener attached to an element; bindings keep firing while the user
          types in it.
        </li>
      </Ul>
      <DemoBlock
        source={useKeyBindingsDemoSource}
        fileName="use-key-bindings-demo.tsx"
      >
        <UseKeyBindingsDemo />
      </DemoBlock>
      <P>
        The player demo on the home page combines{" "}
        <InlineCode>useKeyboardLayer</InlineCode> and{" "}
        <InlineCode>useKeyMonitor</InlineCode> if you want a bigger example.
      </P>
    </>
  );
}
