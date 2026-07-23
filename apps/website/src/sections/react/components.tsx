import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { P } from "@/components/prose";
import KeyboardInputDemo from "@/demos/keyboard-input-demo";
import keyboardInputDemoSource from "@/demos/keyboard-input-demo.tsx?raw";
import KeyboardLayerDemo from "@/demos/keyboard-layer-demo";
import keyboardLayerDemoSource from "@/demos/keyboard-layer-demo.tsx?raw";

export function ComponentsSection() {
  return (
    <>
      <CodeBlock
        code={`// global bindings, renders nothing (the classic react-keyboardist API)
<Keyboardist bindings={{ slash: focusSearch }} monitor={logKeys} />

// scope the keyboard to a subtree while it's mounted
<KeyboardLayer bindings={{ escape: close }} exclusive>
  <Modal />
</KeyboardLayer>

// an input with its own attached listener
<KeyboardInput bindings={{ up: increment, down: decrement }} ref={inputRef} />`}
      />
      <DemoBlock
        source={keyboardLayerDemoSource}
        fileName="keyboard-layer-demo.tsx"
      >
        <KeyboardLayerDemo />
      </DemoBlock>
      <P>
        <strong>KeyboardInput</strong> is the escape hatch for the "form
        elements are ignored" default — an input that keeps its bindings while
        focused:
      </P>
      <DemoBlock
        source={keyboardInputDemoSource}
        fileName="keyboard-input-demo.tsx"
      >
        <KeyboardInputDemo />
      </DemoBlock>
    </>
  );
}
