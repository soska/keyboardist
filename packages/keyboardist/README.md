# 🎹 Keyboardist: Declarative keyboard listener

A declarative way to add keyboard shortcuts to your browser applications, with
zero dependencies.

For using with React, there's
[React Keyboardist](https://github.com/soska/react-keyboardist).

```javascript
import { createListener } from "keyboardist";

// by default it listens to keydown
const listener = createListener();

listener.subscribe("Down", () => {
  console.log("Pressed down");
});

listener.subscribe("Shift+Down", () => {
  console.log("Pressed Shift + down");
});
```

## Install

```sh
npm install keyboardist
```

Keyboardist is published as an ES module.

## Why not just addEventListener?

For one shortcut, you don't need a library:

```javascript
document.addEventListener("keydown", (e) => {
  if (e.key === "k" && e.metaKey) openPalette();
});
```

That's fine — until you add the second shortcut, and the third, and a modal.
Keyboardist exists because the code above quietly grows five hard problems,
and every app ends up hand-rolling the same solutions:

- **Key naming.** `event.key` vs `event.code`, layout quirks, modifier
  combinations, and the `if (e.shiftKey && !e.metaKey && ...)` chains that
  come with them. Keyboardist gives every combination one canonical,
  writable name — `"shift+up"`, `"cmd+k"` — and matching is just a map
  lookup.
- **Typing vs shortcuts.** Raw listeners fire while the user types into an
  input, a textarea, or a contenteditable editor. Everyone discovers this in
  production. Keyboardist ignores editable targets by default (and lets you
  attach to an input deliberately when that's what you want).
- **preventDefault discipline.** Swallow too much and you break the browser;
  too little and the page scrolls when Space was your play button.
  Keyboardist prevents default only when a binding actually matched.
- **Modes and modals.** The genuinely hard one. The moment a modal, command
  palette, or "mode" needs its own keys, you're building a priority system:
  who wins, what's disabled, and how everything is restored when it closes —
  including when two modals overlap and close out of order. That's
  [layers](#layers), and it's the reason this library exists: the ad-hoc
  version of this (save the old handler, restore it in a closure) is exactly
  where hand-rolled implementations grow bugs.
- **Lifecycle.** Subscriptions that clean up after themselves (`unsubscribe`,
  `using`), multiple handlers per key with predictable order and
  stop-propagation, and a [monitor](#key-monitor) so you can see what the
  keyboard is doing instead of sprinkling `console.log` into a raw handler.

All of that for ~3 kB gzipped, zero dependencies, one `addEventListener`
per listener under the hood, and `false` instead of a crash on the server.
If your app has one shortcut, keep the raw listener. The day it has three
and a modal, this is the code you were going to write anyway — already
tested.

## Usage

`createListener` returns a listener object. In non-browser environments (e.g.
during server-side rendering) it returns `false` instead, so check the return
value if your code also runs outside the browser.

`subscribe` accepts two arguments: a key or key combination and a callback that
will run when that key (or key combination) is pressed. The callback receives
the original `KeyboardEvent`.

```javascript
import { createListener } from "keyboardist";

const listener = createListener();

const keySubscription = listener.subscribe("Slash", () => {
  focusSearch();
});
```

### Key names

Friendly names are canonical, and raw `event.code` spellings normalize to the
same key — all of these match the same binding:

| You write | Canonical name |
| --- | --- |
| `a`, `KeyA`, `keya` | `a` |
| `up`, `ArrowUp` | `up` |
| `1`, `Digit1` | `1` (`numpad1` stays distinct) |
| `shift+up`, `Shift + ArrowUp` | `shift+up` |
| `cmd+k`, `Meta+K`, `command+k` | `meta+k` |
| `ctrl+shift+p`, `shift+control+p` | `shift+ctrl+p` |

Case and spaces are ignored; modifiers always normalize to the order
alt, shift, ctrl, meta. A comma binds one handler to several keys:
`subscribe("j,k", fn)` fires for both. If you're unsure of a key's name, use
the [monitor](#key-monitor). The normalizer is exported as
`normalizeKeyName()` if you need it.

The object returned by `subscribe` has an `unsubscribe` method:

```javascript
// create a subscription
const keySubscription = listener.subscribe("Slash", () => {
  focusSearch();
});

// remove the subscription
keySubscription.unsubscribe();
```

## Multiple listeners for a key

You can add multiple listeners for the same key. They run starting from the
last one subscribed, and returning `false` from a callback stops the earlier
ones from running.

```javascript
listener.subscribe("Space", () => {
  console.log("A");
});

listener.subscribe("Space", () => {
  console.log("B");
});

listener.subscribe("Space", () => {
  console.log("C");
});

// the console will log 'C', then 'B', then 'A' when the spacebar is pressed.
```

## Layers

Bindings can live on named **layers** that stack. The topmost layer with a
binding for a key wins and shadows the layers below it; keys that don't match
fall through. This is how you give a modal its own keyboard without tearing
down the rest of the app:

```javascript
const kb = createListener();

// base bindings — always at the bottom of the stack
kb.subscribe("slash", focusSearch);

// a named layer with map registration; commas bind aliases
const player = kb.layer("player", {
  space: togglePlay,
  "j,k": step,
  "shift+up": volumeUp,
});
player.push(); // player bindings are now live

// an exclusive layer: unmatched keys go inert instead of falling through,
// so every player shortcut is disabled while the modal is open
const modal = kb.layer("modal", { escape: closeModal }, { exclusive: true });

const pop = modal.push(); // modal now owns the keyboard
// ...when the modal closes:
pop(); // player (and base) bindings are live again
```

Popping is order-independent: if two modals overlap, popping the lower one
leaves the upper one exactly where it is. Re-pushing an active layer moves it
to the top. Layers also have `subscribe(key, fn)`, `bind(map)` (returns one
subscription for the whole map), `pop()`, `isActive()`, and `dispose()`.

### Priority

When push order can't express who should win — for example when a framework
schedules your pushes in an order you don't control — give layers a
`priority` (default `0`). Higher-priority layers always sit above
lower-priority ones regardless of push order; within the same priority, the
latest push is on top, exactly like before:

```javascript
kb.layer("layout", { escape: closeSidebar }, { priority: 1 });
kb.layer("modal", { escape: closeModal }, { priority: 3 });

// no matter which order these get pushed in, modal beats layout
```

(If you use [react-keyboardist](https://www.npmjs.com/package/react-keyboardist),
priority is derived from the component tree automatically — you shouldn't
need to set it by hand.)

Inspect the stack at runtime with `kb.activeLayers()` (names, top to bottom,
ending in `"base"`) and `kb.getBindings()` (every binding with its layer and
active state).

## Key monitor

The listener has a `setMonitor` method that lets you set a function that will
observe every key event. Pass `true` to use the default built-in monitor
(which logs to the console) or pass your own function. Pass `false` (or
nothing) to clear it.

The default monitor is useful in development when you don't know the correct
key name you want to use.

```javascript
const listener = createListener();

// use the default monitor
listener.setMonitor(true);

// will show the key names / combination as you type them. For example:
// `:keyboard event: a`
// `:keyboard event: slash`
// `:keyboard event: shift+space`
```

A custom monitor receives a single object: `keyName` (canonical name),
`matched` (true if a binding won), `layer` (the winning layer's name, or
`null`), and the original `event`.

```javascript
listener.setMonitor(({ keyName, matched, layer, event }) => {
  document.getElementById("monitor").innerHTML = `You pressed ${keyName}`;
});
```

## Other events

By default the listener listens to `keydown` events, but you can pass `keyup`
to use that event instead:

```javascript
import { createListener } from "keyboardist";

const downListener = createListener();
const upListener = createListener("keyup");

downListener.subscribe("KeyA", () => {
  console.log("Just pressed the A key");
});

upListener.subscribe("KeyA", () => {
  console.log("Just released the A key");
});
```

## Listening on a specific element

`createListener` accepts an element as a second argument. By default it
listens on `document`. Keyboard events originating from form elements
(`input`, `textarea`, `select`, `button`) are ignored — unless the listener is
attached to that element directly:

```javascript
const input = document.getElementById("search");
const inputListener = createListener("keydown", input);

inputListener.subscribe("Escape", () => input.blur());
```

## Stop listening

Internally each listener attaches a single event handler to the target
element. `stopListening` removes it; `startListening` re-attaches it.

```javascript
const listener = createListener();

listener.subscribe("KeyA", () => {
  console.log("Just pressed the A key");
});

// Remove the event listener from the document
listener.stopListening();

// Reattach it again:
listener.startListening();
```

## `using` support

Subscriptions and layer push-handles implement `[Symbol.dispose]`, so they
work with explicit resource management:

```typescript
{
  using sub = kb.subscribe("slash", focusSearch);
  using modalSession = modal.push();
  // ...
} // automatically unsubscribed and popped here
```

## TypeScript

Keyboardist ships its own type definitions:

```typescript
import {
  createListener,
  type KeyboardistListener,
  type Layer,
  type MonitorInfo,
  type Subscription,
} from "keyboardist";
```

## License

MIT © [Armando Sosa](https://armandososa.org)
