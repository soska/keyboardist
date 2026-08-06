import { CodeBlock } from "@/components/code/code-block";
import { InlineCode, P } from "@/components/prose";

export function UsageSection() {
  return (
    <>
      <P>
        <InlineCode>createListener</InlineCode> returns a listener object. In
        non-browser environments (e.g. during server-side rendering) it returns{" "}
        <InlineCode>false</InlineCode> instead, so check the return value if
        your code also runs outside the browser.
      </P>
      <P>
        <InlineCode>subscribe</InlineCode> accepts two arguments: a key or key
        combination and a callback that will run when that key (or key
        combination) is pressed. The callback receives the original{" "}
        <InlineCode>KeyboardEvent</InlineCode>.
      </P>
      <CodeBlock
        lang="typescript"
        code={`import { createListener } from "keyboardist";

const listener = createListener();

const keySubscription = listener.subscribe("Slash", () => {
  focusSearch();
});`}
      />
      <P>
        The object returned by <InlineCode>subscribe</InlineCode> has an{" "}
        <InlineCode>unsubscribe</InlineCode> method:
      </P>
      <CodeBlock
        lang="typescript"
        code={`// create a subscription
const keySubscription = listener.subscribe("Slash", () => {
  focusSearch();
});

// remove the subscription
keySubscription.unsubscribe();`}
      />
    </>
  );
}
