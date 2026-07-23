# 🎹⚛️ React Keyboardist

React hooks and components for [keyboardist](https://www.npmjs.com/package/keyboardist) —
declarative keyboard shortcuts with layers. Zero configuration, RSC-safe.

```jsx
import { Keyboardist } from "react-keyboardist";

// works directly inside a Next.js server component tree —
// the package ships its own "use client" boundary
export default function Page() {
  return (
    <>
      <Keyboardist bindings={{ "cmd+k": openPalette, slash: focusSearch }} />
      <Content />
    </>
  );
}
```

## Install

```sh
npm install react-keyboardist
```

Requires React 18 or 19. `react-keyboardist` 3.x pairs with `keyboardist` 3.x
(installed automatically as a dependency).

## Hooks

### useKeyBindings

Global bindings for the lifetime of the component. Inline objects are fine —
resubscription only happens when the set of keys changes, and callbacks are
always the latest render's.

```jsx
import { useKeyBindings } from "react-keyboardist";

function Player() {
  useKeyBindings({
    space: togglePlay,
    "j,k": step, // comma binds aliases
    "shift+up": volumeUp,
  });
  return <>...</>;
}
```

Key names follow keyboardist's canonical scheme (`shift+up`, `cmd+k`, `1`);
raw `event.code` spellings work too.

### useKeyboardLayer

A [keyboardist layer](https://github.com/soska/keyboardist/tree/master/packages/keyboardist#layers)
scoped to the component: created on mount, pushed while `active` (default
`true`), disposed on unmount. With `exclusive: true`, unmatched keys go inert —
perfect for modals.

```jsx
function SearchModal({ onClose }) {
  useKeyboardLayer({ escape: onClose }, { exclusive: true });
  return <dialog open>...</dialog>;
}
```

Also returns a handle: `const layer = useKeyboardLayer(...)` →
`layer.isActive()`, `layer.push()`, `layer.pop()`.

### Nesting is priority

When layers overlap on the same key, **the innermost component wins** —
the JSX nesting is the priority:

```jsx
<DashboardLayout>            {/* KeyboardLayer: escape → close sidebar */}
  <Posts>                    {/* KeyboardLayer: escape → clear selection */}
    <EditPostModal />        {/* KeyboardLayer: escape → close modal ← wins */}
  </Posts>
</DashboardLayout>
```

This holds even when the whole tree mounts in a single commit. (React runs
effects child-first, so without this the *outermost* layer would land on top
of the stack — an inversion that only shows up on initial renders and deep
links.) Priority is derived from `<KeyboardLayer>` nesting via context, so
it also flows through portals: a modal rendered with `createPortal` keeps
the priority of its place in the JSX tree, not the DOM.

Hook-only users can add a nesting level without creating a layer using
`<KeyboardScope>`; and an explicit `priority` prop/option overrides the
derived depth for the rare cross-tree case.

### useKeyMonitor

Observe every key event (one monitor slot per listener — last mounted wins):

```jsx
useKeyMonitor(({ keyName, matched, layer }) => {
  setDisplay(matched ? `${keyName} → ${layer}` : keyName);
});
```

### useElementKeyBindings

Attach bindings to a specific element — they keep firing while the user types
in it:

```jsx
const inputRef = useRef(null);
useElementKeyBindings(inputRef, { escape: clear, up: next, down: prev });
return <input ref={inputRef} />;
```

## Components

Thin wrappers over the hooks, for JSX-first code:

```jsx
import Keyboardist, { KeyboardLayer, KeyboardInput } from "react-keyboardist";

// global bindings, renders nothing (the classic react-keyboardist API)
<Keyboardist bindings={{ slash: focusSearch }} monitor={logKeys} />

// scope the keyboard to a subtree while it's mounted
<KeyboardLayer bindings={{ escape: close }} exclusive>
  <Modal />
</KeyboardLayer>

// an input with its own attached listener
<KeyboardInput bindings={{ up: increment, down: decrement }} ref={inputRef} />
```

`<KeyboardLayer>` also accepts `active` (boolean) to toggle the layer without
unmounting, and `name` if you want a stable layer name for introspection.

## Server-side rendering & React Server Components

- The published bundle starts with `'use client'`, so importing any component
  from a server component automatically creates the client boundary.
- Listeners are created lazily on first client-side effect — importing the
  package never touches `window`, and rendering on the server is a no-op.
- All bindings attach in effects, so SSR + hydration behave correctly.

## License

MIT © [Armando Sosa](https://armandososa.org)
