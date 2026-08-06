---
"keyboardist": major
---

React support now ships inside keyboardist itself, as the `keyboardist/react` subpath — the separate `react-keyboardist` package is retired (frozen at 0.2.0).

```jsx
import Keyboardist, { KeyboardLayer, useKeyBindings } from "keyboardist/react";
```

- **Hooks**: `useKeyBindings(map)`, `useKeyboardLayer(map, { exclusive, active })`, `useKeyMonitor(fn)`, and `useElementKeyBindings(ref, map)`.
- **Components**: `<Keyboardist bindings monitor?>` (the classic API, default export of the subpath), `<KeyboardLayer>` scoping the keyboard to its children, `<KeyboardScope>` for hook-only nesting, and `<KeyboardInput>` with ref forwarding.
- **RSC/Next.js-safe**: the `./react` bundle carries its own `'use client'` directive, listeners are created lazily in effects (never at module scope), and importing either subpath is safe without a DOM.
- **Inline-friendly**: bindings objects can be inline JSX props — callbacks are read through refs and resubscription only happens when the key set changes.
- One install, one version: `react` is an **optional peer dependency**, so vanilla users see no peer warnings. Requires React 18 or 19 when the subpath is used.
