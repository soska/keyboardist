import { Link } from "@tanstack/react-router";
import { CodeBlock } from "@/components/code/code-block";
import { DocsLayout } from "@/components/layout/docs-layout";
import { A, InlineCode, P, Ul } from "@/components/prose";
import { usePageTitle } from "@/lib/use-page-title";

function InstallSection() {
  return (
    <>
      <CodeBlock code="npm install keyboardist" lang="bash" />
      <P>
        Keyboardist is published as an ES module. Using React? Hooks and
        components ship in the same package — see the{" "}
        <Link
          to="/react"
          className="text-zinc-900 underline dark:text-zinc-100"
        >
          React docs
        </Link>
        .
      </P>
    </>
  );
}

function QuickStartSection() {
  return (
    <>
      <P>
        <InlineCode>createListener</InlineCode> returns a listener object, and{" "}
        <InlineCode>subscribe</InlineCode> binds a key (or key combination) to a
        callback:
      </P>
      <CodeBlock
        lang="typescript"
        code={`import { createListener } from "keyboardist";

// by default it listens to keydown
const listener = createListener();

listener.subscribe("Down", () => {
  console.log("Pressed down");
});

listener.subscribe("Shift+Down", () => {
  console.log("Pressed Shift + down");
});`}
      />
      <P>
        That's the whole model. From here, the{" "}
        <Link to="/core" className="text-zinc-900 underline dark:text-zinc-100">
          Core docs
        </Link>{" "}
        cover key names, layers, the monitor, and lifecycle — and the{" "}
        <Link
          to="/react"
          className="text-zinc-900 underline dark:text-zinc-100"
        >
          React docs
        </Link>{" "}
        cover the hooks and components built on top.
      </P>
    </>
  );
}

function WhySection() {
  return (
    <>
      <P>For one shortcut, you don't need a library:</P>
      <CodeBlock
        lang="typescript"
        code={`document.addEventListener("keydown", (e) => {
  if (e.key === "k" && e.metaKey) openPalette();
});`}
      />
      <P>
        That's fine — until you add the second shortcut, and the third, and a
        modal. Keyboardist exists because the code above quietly grows five hard
        problems, and every app ends up hand-rolling the same solutions:
      </P>
      <Ul>
        <li>
          <strong>Key naming.</strong> <InlineCode>event.key</InlineCode> vs{" "}
          <InlineCode>event.code</InlineCode>, layout quirks, modifier
          combinations, and the{" "}
          <InlineCode>if (e.shiftKey && !e.metaKey && ...)</InlineCode> chains
          that come with them. Keyboardist gives every combination one
          canonical, writable name — <InlineCode>"shift+up"</InlineCode>,{" "}
          <InlineCode>"cmd+k"</InlineCode> — and matching is just a map lookup.
        </li>
        <li>
          <strong>Typing vs shortcuts.</strong> Raw listeners fire while the
          user types into an input, a textarea, or a contenteditable editor.
          Everyone discovers this in production. Keyboardist ignores editable
          targets by default (and lets you attach to an input deliberately when
          that's what you want).
        </li>
        <li>
          <strong>preventDefault discipline.</strong> Swallow too much and you
          break the browser; too little and the page scrolls when Space was your
          play button. Keyboardist prevents default only when a binding actually
          matched.
        </li>
        <li>
          <strong>Modes and modals.</strong> The genuinely hard one. The moment
          a modal, command palette, or "mode" needs its own keys, you're
          building a priority system: who wins, what's disabled, and how
          everything is restored when it closes — including when two modals
          overlap and close out of order. That's{" "}
          <A href="/core#layers">layers</A>, and it's the reason this library
          exists: the ad-hoc version of this (save the old handler, restore it
          in a closure) is exactly where hand-rolled implementations grow bugs.
        </li>
        <li>
          <strong>Lifecycle.</strong> Subscriptions that clean up after
          themselves (<InlineCode>unsubscribe</InlineCode>,{" "}
          <InlineCode>using</InlineCode>), multiple handlers per key with
          predictable order and stop-propagation, and a{" "}
          <A href="/core#monitor">monitor</A> so you can see what the keyboard
          is doing instead of sprinkling <InlineCode>console.log</InlineCode>{" "}
          into a raw handler.
        </li>
      </Ul>
      <P>
        All of that for ~3 kB gzipped, zero dependencies, one{" "}
        <InlineCode>addEventListener</InlineCode> per listener under the hood,
        and <InlineCode>false</InlineCode> instead of a crash on the server. If
        your app has one shortcut, keep the raw listener. The day it has three
        and a modal, this is the code you were going to write anyway — already
        tested.
      </P>
    </>
  );
}

const sections = [
  { id: "install", title: "Install", Component: InstallSection },
  { id: "quick-start", title: "Quick start", Component: QuickStartSection },
  {
    id: "why",
    title: "Why not just addEventListener?",
    Component: WhySection,
  },
];

export function GettingStartedPage() {
  usePageTitle("Getting started");
  return (
    <DocsLayout
      title="Getting started"
      intro={
        <P>
          Keyboardist is a declarative keyboard listener for the browser, with
          zero dependencies.
        </P>
      }
      sections={sections}
    />
  );
}
