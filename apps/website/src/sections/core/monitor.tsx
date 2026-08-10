import { CodeBlock } from "@/components/code/code-block";
import { DemoBlock } from "@/components/demo-block";
import { InlineCode, P } from "@/components/prose";
import MonitorDemo from "@/demos/monitor-demo";
import monitorDemoSource from "@/demos/monitor-demo.tsx?raw";

export function MonitorSection() {
  return (
    <>
      <P>
        The listener has a <InlineCode>setMonitor</InlineCode> method that lets
        you set a function that will observe every key event. Pass{" "}
        <InlineCode>true</InlineCode> to use the default built-in monitor (which
        logs to the console) or pass your own function. Pass{" "}
        <InlineCode>false</InlineCode> (or nothing) to clear it.
      </P>
      <P>
        The default monitor is useful in development when you don't know the
        correct key name you want to use.
      </P>
      <CodeBlock
        lang="typescript"
        code={`const listener = createListener();

// use the default monitor
listener.setMonitor(true);

// will show the key names / combination as you type them. For example:
// \`:keyboard event: a\`
// \`:keyboard event: slash\`
// \`:keyboard event: shift+space\``}
      />
      <P>
        A custom monitor receives a single object:{" "}
        <InlineCode>keyName</InlineCode> (canonical name),{" "}
        <InlineCode>matched</InlineCode> (true if a binding won),{" "}
        <InlineCode>layer</InlineCode> (the winning layer's name, or{" "}
        <InlineCode>null</InlineCode>), and the original{" "}
        <InlineCode>event</InlineCode>.
      </P>
      <CodeBlock
        lang="typescript"
        code={`listener.setMonitor(({ keyName, matched, layer, event }) => {
  document.getElementById("monitor").innerHTML = \`You pressed \${keyName}\`;
});`}
      />
      <DemoBlock source={monitorDemoSource} fileName="monitor-demo.tsx">
        <MonitorDemo />
      </DemoBlock>
    </>
  );
}
