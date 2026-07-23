---
"keyboardist": major
---

Layers, a key-naming spec, and modern ergonomics — the KeyboardService lessons.

**New: layers.** Bindings can now live on named layers that stack: `kb.layer("modal", { escape: close }, { exclusive: true })`, then `layer.push()` to activate (returns a pop function) and `layer.pop()` to restore. The topmost layer with a binding for a key wins and shadows layers below; unmatched keys fall through, unless the layer is `exclusive: true`, which makes unmatched keys inert (the modal case). Popping is order-independent, so overlapping modals restore cleanly. Layers support map registration (`{ "j,k": fn }` — comma binds aliases) via the layer constructor, `layer.bind(map)`, and `layer.subscribe(key, fn)`.

**New: canonical key names.** Friendly names are now canonical: `shift+up`, `a`, `slash`, `1`. Raw `event.code` spellings (`Shift+ArrowUp`, `KeyA`, `Digit1`) normalize to the same key, so existing subscription strings keep working. Modifiers order themselves canonically (alt, shift, ctrl, meta) and accept aliases (`cmd`/`command` → meta, `control` → ctrl, `option` → alt). `numpad1` stays distinct from `1`. Exposed as `normalizeKeyName()`.

**Breaking: structured monitor.** `setMonitor` callbacks now receive one object — `{ keyName, matched, layer, event }` — instead of positional `(keyName, matched, event)` arguments.

**Breaking: editable-target detection.** Keystrokes in `contenteditable` regions are now ignored (previously they fired shortcuts), and focused `<button>` elements no longer suppress shortcuts (previously they did).

**New: introspection.** `kb.activeLayers()` returns active layer names top→bottom; `kb.getBindings()` lists every binding with its layer and active state.

**New: explicit resource management.** Subscriptions and layer push-handles implement `[Symbol.dispose]`, so they work with `using` declarations; disposing equals `unsubscribe()`/popping.
