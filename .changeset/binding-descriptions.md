---
"keyboardist": minor
---

Self-documenting bindings.

- **core**: `subscribe()` takes an optional third argument describing the binding — either an options object (`{ description, hidden }`) or a bare string as shorthand for `{ description }`. `getBindings()` returns the `description` alongside the existing `layer`/`key`/`active`/`priority`, so a UI can generate its own shortcut sheet from the live bindings. `hidden: true` keeps a binding out of that listing while leaving it fully functional.
- **core**: `BindingMap` values accept an object form — `{ handler, description, hidden }` — anywhere a bare callback works today (`layer()`, `bind()`, and the React bindings props). Bare callbacks are unchanged.
- **`keyboardist/react`**: descriptions flow through `useKeyBindings`, `useKeyboardLayer`, `useElementKeyBindings`, and the components that wrap them. Editing a description now resubscribes correctly — previously the dependency signature only tracked the key set, so a changed description would have gone stale.
- Where one key has several subscriptions in a layer, the last one subscribed wins per field — it is also the first to run, so it is the one the user actually gets. Unsubscribing it falls back to the description beneath.

Descriptions are purely additive: every existing call signature keeps working.
