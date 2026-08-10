# keyboardist

## 3.0.0

### Major Changes

- [#50](https://github.com/soska/keyboardist/pull/50) [`c985f85`](https://github.com/soska/keyboardist/commit/c985f855d8747900c93ba0c0ed9b0b0fb9cb7b1b) Thanks [@soska](https://github.com/soska)! - React support now ships inside keyboardist itself, as the `keyboardist/react` subpath — the separate `react-keyboardist` package is retired (frozen at 0.2.0).

  ```jsx
  import Keyboardist, {
    KeyboardLayer,
    useKeyBindings,
  } from "keyboardist/react";
  ```

  - **Hooks**: `useKeyBindings(map)`, `useKeyboardLayer(map, { exclusive, active })`, `useKeyMonitor(fn)`, and `useElementKeyBindings(ref, map)`.
  - **Components**: `<Keyboardist bindings monitor?>` (the classic API, default export of the subpath), `<KeyboardLayer>` scoping the keyboard to its children, `<KeyboardScope>` for hook-only nesting, and `<KeyboardInput>` with ref forwarding.
  - **RSC/Next.js-safe**: the `./react` bundle carries its own `'use client'` directive, listeners are created lazily in effects (never at module scope), and importing either subpath is safe without a DOM.
  - **Inline-friendly**: bindings objects can be inline JSX props — callbacks are read through refs and resubscription only happens when the key set changes.
  - One install, one version: `react` is an **optional peer dependency**, so vanilla users see no peer warnings. Requires React 18 or 19 when the subpath is used.

- [#48](https://github.com/soska/keyboardist/pull/48) [`d7e4477`](https://github.com/soska/keyboardist/commit/d7e44775d0e3cfbe185e3ed2ec45dc92e34f31d8) Thanks [@soska](https://github.com/soska)! - Keyboardist 3.0 groundwork: modernized build and repo.

  - **ESM-only**: the package now ships only ES modules with a proper `exports` map. CommonJS `require()` is no longer supported.
  - **Zero dependencies**: the `@jiveworld/minibus` dependency is gone. Subscriptions are handled internally again, restoring the documented behavior that the 2.x minibus refactor had silently broken: subscriptions are scoped per listener instance (no longer shared globally between listeners of the same event type), callbacks receive the `KeyboardEvent`, multiple subscriptions to the same key run last-subscribed-first, and returning `false` from a callback stops propagation.
  - **Type changes**: the exported `KeyboardEvent` type alias (which shadowed the DOM type) is now `KeyboardEventName`. New exported types: `SubscriptionCallback`, `MonitorCallback`, `Subscription`.
  - `setMonitor(false)` / `setMonitor()` now clears a previously set monitor.
  - Node 20.19+ (for tooling; the library itself targets browsers).

- [#49](https://github.com/soska/keyboardist/pull/49) [`f352483`](https://github.com/soska/keyboardist/commit/f3524838e1ea272a85fd1ae8f450a18d4b3a7c5b) Thanks [@soska](https://github.com/soska)! - Layers, a key-naming spec, and modern ergonomics — the KeyboardService lessons.

  **New: layers.** Bindings can now live on named layers that stack: `kb.layer("modal", { escape: close }, { exclusive: true })`, then `layer.push()` to activate (returns a pop function) and `layer.pop()` to restore. The topmost layer with a binding for a key wins and shadows layers below; unmatched keys fall through, unless the layer is `exclusive: true`, which makes unmatched keys inert (the modal case). Popping is order-independent, so overlapping modals restore cleanly. Layers support map registration (`{ "j,k": fn }` — comma binds aliases) via the layer constructor, `layer.bind(map)`, and `layer.subscribe(key, fn)`.

  **New: canonical key names.** Friendly names are now canonical: `shift+up`, `a`, `slash`, `1`. Raw `event.code` spellings (`Shift+ArrowUp`, `KeyA`, `Digit1`) normalize to the same key, so existing subscription strings keep working. Modifiers order themselves canonically (alt, shift, ctrl, meta) and accept aliases (`cmd`/`command` → meta, `control` → ctrl, `option` → alt). `numpad1` stays distinct from `1`. Exposed as `normalizeKeyName()`.

  **Breaking: structured monitor.** `setMonitor` callbacks now receive one object — `{ keyName, matched, layer, event }` — instead of positional `(keyName, matched, event)` arguments.

  **Breaking: editable-target detection.** Keystrokes in `contenteditable` regions are now ignored (previously they fired shortcuts), and focused `<button>` elements no longer suppress shortcuts (previously they did).

  **New: introspection.** `kb.activeLayers()` returns active layer names top→bottom; `kb.getBindings()` lists every binding with its layer and active state.

  **New: explicit resource management.** Subscriptions and layer push-handles implement `[Symbol.dispose]`, so they work with `using` declarations; disposing equals `unsubscribe()`/popping.

### Minor Changes

- [#53](https://github.com/soska/keyboardist/pull/53) [`eddc0ca`](https://github.com/soska/keyboardist/commit/eddc0ca471d0ab3bbdb04330f5889198d08e6f85) Thanks [@soska](https://github.com/soska)! - Self-documenting bindings.

  - **core**: `subscribe()` takes an optional third argument describing the binding — either an options object (`{ description, hidden }`) or a bare string as shorthand for `{ description }`. `getBindings()` returns the `description` alongside the existing `layer`/`key`/`active`/`priority`, so a UI can generate its own shortcut sheet from the live bindings. `hidden: true` keeps a binding out of that listing while leaving it fully functional.
  - **core**: `BindingMap` values accept an object form — `{ handler, description, hidden }` — anywhere a bare callback works today (`layer()`, `bind()`, and the React bindings props). Bare callbacks are unchanged.
  - **`keyboardist/react`**: descriptions flow through `useKeyBindings`, `useKeyboardLayer`, `useElementKeyBindings`, and the components that wrap them. Editing a description now resubscribes correctly — previously the dependency signature only tracked the key set, so a changed description would have gone stale.
  - Where one key has several subscriptions in a layer, the last one subscribed wins per field — it is also the first to run, so it is the one the user actually gets. Unsubscribing it falls back to the description beneath.

  Descriptions are purely additive: every existing call signature keeps working.

- [#51](https://github.com/soska/keyboardist/pull/51) [`d5c0d91`](https://github.com/soska/keyboardist/commit/d5c0d912a263a273e459cd426619a48db8abb96d) Thanks [@soska](https://github.com/soska)! - Nesting-aware layer priority.

  - **core**: `LayerOptions` gains `priority` (default `0`). Higher-priority layers always sit above lower-priority ones regardless of push order; within a priority, the latest push stays on top (existing behavior unchanged). `Layer.priority` and `getBindings()` expose it.
  - **`keyboardist/react`**: layer priority is now derived from the component tree — nested `<KeyboardLayer>`s (and `<KeyboardScope>`, new, for hook-only composition) win overlapping keys from the inside out, even when the whole tree mounts in one commit. This fixes the inversion where React's child-first effect order put the _outermost_ layer on top on initial renders and deep links. Works through portals; an explicit `priority` prop/option overrides the derived depth.
