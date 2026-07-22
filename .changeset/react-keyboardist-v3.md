---
"react-keyboardist": major
---

react-keyboardist joins the keyboardist monorepo, rewritten for React 18/19 and React Server Components.

- **Hooks API**: `useKeyBindings(map)`, `useKeyboardLayer(map, { exclusive, active })`, `useKeyMonitor(fn)`, and `useElementKeyBindings(ref, map)`.
- **Components**: `<Keyboardist bindings monitor?>` (still the default export, renders nothing), new `<KeyboardLayer bindings exclusive? active?>` that scopes the keyboard to its children while mounted, and `<KeyboardInput>` (ports the old element-attached input, now with ref forwarding).
- **RSC/Next.js-safe**: the bundle ships a `'use client'` directive, so components drop straight into server-component trees; listeners are created lazily on first client use (never at module scope), and importing the package is safe without a DOM.
- **Inline-friendly**: bindings objects can be inline JSX props — callbacks are read through refs and resubscription only happens when the key set changes.
- Powered by keyboardist 3 layers; versions are now locked to `keyboardist` (3.x pairs with 3.x). Requires React 18 or 19.
