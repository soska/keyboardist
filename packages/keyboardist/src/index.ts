import getKeyEventName from "./get-key-event-name";
import isEventModifier from "./is-event-modifier";
import isInputElement from "./is-input-element";
import isInputEvent from "./is-input-event";

export type KeyboardEventName = "keydown" | "keyup";

// biome-ignore lint/suspicious/noConfusingVoidType: callbacks may return nothing; `undefined` would reject void-returning functions
export type SubscriptionCallback = (event: KeyboardEvent) => boolean | void;

export type MonitorCallback = (
  eventName: string,
  matched: boolean,
  event: KeyboardEvent,
) => void;

export interface Subscription {
  unsubscribe: () => void;
}

export interface KeyboardistListener {
  subscribe: (name: string, callback: SubscriptionCallback) => Subscription;
  setMonitor: (monitor?: MonitorCallback | boolean) => void;
  startListening: () => void;
  stopListening: () => void;
}

const defaultMonitor: MonitorCallback = (eventName) => {
  console.log(":keyboard event:", eventName);
};

// Subscription names are lowercased and spaces removed so 'Shift + Space',
// 'Shift+Space' and 'shift+space' are all equivalent.
function normalize(name: string) {
  return name.toLowerCase().replace(/\s/g, "");
}

export function createListener(
  listenForEvent: KeyboardEventName = "keydown",
  element: Document | Element | null = null,
): false | KeyboardistListener {
  if (typeof window === "undefined") {
    // not a browser environment
    return false;
  }

  const target = element ?? window.document;

  // Subscriptions are scoped to this listener instance. Callbacks run in
  // LIFO order (last subscribed runs first); returning false from a
  // callback stops propagation to earlier subscriptions.
  const subscriptions = new Map<string, SubscriptionCallback[]>();
  let monitor: MonitorCallback | null = null;

  // ignore input events, except when the listener is attached to an input.
  const ignoreInputEvents = !isInputElement(target);

  function handleKeyEvent(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (isEventModifier(keyboardEvent)) {
      return;
    }

    if (ignoreInputEvents && isInputEvent(keyboardEvent)) {
      return;
    }

    const eventName = getKeyEventName(keyboardEvent);
    const listeners = subscriptions.get(normalize(eventName)) ?? [];

    if (monitor) {
      monitor(eventName, listeners.length > 0, keyboardEvent);
    }

    if (listeners.length > 0) {
      keyboardEvent.preventDefault();
    }

    for (let i = listeners.length - 1; i >= 0; i--) {
      const propagate = listeners[i]?.(keyboardEvent);
      if (propagate === false) {
        break;
      }
    }
  }

  function subscribe(
    name: string,
    callback: SubscriptionCallback,
  ): Subscription {
    const key = normalize(name);
    const listeners = subscriptions.get(key) ?? [];
    listeners.push(callback);
    subscriptions.set(key, listeners);

    return {
      unsubscribe() {
        const current = subscriptions.get(key);
        if (!current) {
          return;
        }
        const index = current.indexOf(callback);
        if (index !== -1) {
          current.splice(index, 1);
        }
      },
    };
  }

  function setMonitor(nextMonitor: MonitorCallback | boolean = false) {
    if (nextMonitor === true) {
      monitor = defaultMonitor;
    } else if (typeof nextMonitor === "function") {
      monitor = nextMonitor;
    } else {
      monitor = null;
    }
  }

  function startListening() {
    target.addEventListener(listenForEvent, handleKeyEvent);
  }

  function stopListening() {
    target.removeEventListener(listenForEvent, handleKeyEvent);
  }

  startListening();

  return { subscribe, setMonitor, startListening, stopListening };
}
