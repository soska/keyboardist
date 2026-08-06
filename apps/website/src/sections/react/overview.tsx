import { CodeBlock } from "@/components/code/code-block";
import { InlineCode, P, Ul } from "@/components/prose";

export function OverviewSection() {
  return (
    <>
      <P>
        React hooks and components ship as a subpath of the same package — one
        install, one version, RSC-safe:
      </P>
      <CodeBlock
        code={`import Keyboardist, { KeyboardLayer, useKeyBindings } from "keyboardist/react";

// works directly inside a Next.js server component tree — the subpath
// ships its own "use client" boundary
export default function Page() {
  return (
    <>
      <Keyboardist bindings={{ "cmd+k": openPalette, slash: focusSearch }} />
      <Content />
    </>
  );
}`}
      />
      <P>
        Requires React 18 or 19 (an <em>optional</em> peer dependency — vanilla
        users see no peer warnings).
      </P>
      <P>Server-side rendering and React Server Components are handled:</P>
      <Ul>
        <li>
          The <InlineCode>keyboardist/react</InlineCode> bundle starts with{" "}
          <InlineCode>'use client'</InlineCode>, so importing any component from
          a server component automatically creates the client boundary.
        </li>
        <li>
          Listeners are created lazily on first client-side effect — importing
          the package never touches <InlineCode>window</InlineCode>, and
          rendering on the server is a no-op.
        </li>
      </Ul>
    </>
  );
}
