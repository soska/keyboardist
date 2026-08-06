import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import ElementInputDemo from "@/demos/element-input-demo";
import elementInputDemoSource from "@/demos/element-input-demo.tsx?raw";

export function ElementSection() {
  return (
    <>
      <P>
        <InlineCode>createListener</InlineCode> accepts an element as a second
        argument. By default it listens on <InlineCode>document</InlineCode>.
        Keyboard events originating from form elements (
        <InlineCode>input</InlineCode>, <InlineCode>textarea</InlineCode>,{" "}
        <InlineCode>select</InlineCode>, <InlineCode>button</InlineCode>) are
        ignored — unless the listener is attached to that element directly:
      </P>
      <CodeBlock
        lang="typescript"
        code={`const input = document.getElementById("search");
const inputListener = createListener("keydown", input);

inputListener.subscribe("Escape", () => input.blur());`}
      />
      <DemoBlock
        source={elementInputDemoSource}
        fileName="element-input-demo.tsx"
      >
        <ElementInputDemo />
      </DemoBlock>
    </>
  );
}
