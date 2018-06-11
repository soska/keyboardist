# 🎹 Keyboardist: Declarative keyboard listener

![](assets/cover.png)

A declarative way to add keyboard shortcuts to your browser applications.
[Here is a simple demo](https://soska.github.io/keyboardist.js/docs/index.html)

For using with React, there's
[React Keyboardist](https://github.com/soska/react-keyboardist).

Example:

```javascript
// by default it listens to keydown
const listener = Keyboardist();

listener.subscribe('Down', () => {
  console.log('Pressed down');
});

listener.subscribe('Shift+Down', () => {
  console.log('Pressed Shift + down');
});
```

## Install

Example:

```
$ npm install keyboardist
```

## Usage

The `Keyboardist` constructor returns a listener object that has only one method:
`subscribe`.

`subscribe` accepts two arguments: a key or key combination and a method that
will be called when that key (or key combination) is triggered by the user.

Example:

```javascript
import Keyboardist from 'keyboardist';

const listener = new Keyboardist();

const keySubscription = listener.subscribe('Slash', () => {
  focusSearch();
});
```

The object returned by `subscribe` has an `unsubscribe` method.

```javascript
// create a subscription
const keySubscription = listener.subscribe('Slash', () => {
  focusSearch();
});

// remove the subscription
keySubscription.unsubscribe();
```

## Multiple listeners for a Key

You can add multiple listeners for the same key, and they will be executed
starting from the last one.

```javascript
// create a subscription

listener.subscribe('Space', () => {
  console.log('A');
});

listener.subscribe('Space', () => {
  console.log('B');
});

listener.subscribe('Space', () => {
  console.log('C');
});

// the console will log 'C', then 'B', then 'A' when the spacebr is pressed.
```

You can stop the _propagation_ of the event chain by returning `false` from the
listener.

```javascript
// create a subscription

listener.subscribe('Space', () => {
  console.log('A');
  // this will never fire
});

listener.subscribe('Space', () => {
  console.log('B');
  // returns false, stops propagation
  return false;
});

listener.subscribe('Space', () => {
  console.log('C');
});

// the console will log 'C', then 'B'.
```

## Key Monitor

Keyboardist's event listener has a `setMonitor` method that let's you set a
function that will monitor all key events. You can either pass `true` to use the
default built-in monitor or pass a function.

Default monitor is useful in development when you don't know the correct key
name you want to use.

```javascript
const listener = new Keyboardist();
// ue the default monitor
listener.setMonitor(true);

// will show the key names / combination as you type them. For example:
// `:keyboard event: KeyA`
// `:keyboard event: Slash`
// `:keyboard event: Shift+Space`
```

You can also pass a custom function that accepts three parameters: `keyName`,
`matched` which is true if there's at least a listener for that key, and the
`originalEvent` (which has already been _preventDefaulted_ at this point).

```javascript
const listener = new Keyboardist();
// ue the default monitor
listener.setMonitor((keyName, matched, originalEvent) => {
  document.getElementById('monitor').innerHTML = `You pressed ${keyName}`;
});
```

You can see an implementation example
[in the demo](https://soska.github.io/keyboardist.js/docs/index.html)

## Other events

By default, the listener listens to `keydown` events, but you can pass `keyup`
as an argument to `Keyboardist` to use that event instead

```javascript
const downListener = Keyboardist();
const upListener = Keyboardist('keyup');

downListener.subscribe('a', () => {
  console.log('Just pressed the A key');
});

upListener.subscribe('a', () => {
  console.log('Just released the A key');
});
```

## Stop listening

Internally `createListener` attaches only one event listener to your document to listen to your keystrokes. If you ever want to remove that listener you can call `stopListening` on the listener instance.

```javascript
const listener = Keyboardist();

listener.subscribe('a', () => {
  console.log('Just pressed the A key');
});

// Remove the event listener from the document
listener.stopListening();

// Reattach it again:
listener.startListening();


```