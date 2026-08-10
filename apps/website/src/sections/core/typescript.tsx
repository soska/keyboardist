import { CodeBlock } from "@/components/code/code-block";
import { P } from "@/components/prose";

export function TypescriptSection() {
  return (
    <>
      <P>Keyboardist ships its own type definitions:</P>
      <CodeBlock
        lang="typescript"
        code={`import {
  createListener,
  type KeyboardistListener,
  type Layer,
  type MonitorInfo,
  type Subscription,
} from "keyboardist";`}
      />
    </>
  );
}
