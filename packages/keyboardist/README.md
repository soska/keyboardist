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

Key names are matched case-insensitively and spaces are ignored, so
`"Shift+Space"`, `"shift+space"`, and `"Shift + Space"` are all equivalent.

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
// `:keyboard event: KeyA`
// `:keyboard event: Slash`
// `:keyboard event: Shift+Space`
```

A custom monitor function receives three arguments: the `keyName`, `matched`
(true if there's at least one subscription for that key), and the original
`KeyboardEvent`.

```javascript
listener.setMonitor((keyName, matched, originalEvent) => {
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

## TypeScript

Keyboardist ships its own type definitions:

```typescript
import {
  createListener,
  type KeyboardistListener,
  type Subscription,
} from "keyboardist";
```

## License

MIT © [Armando Sosa](https://armandososa.org)
