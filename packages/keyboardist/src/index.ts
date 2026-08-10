import getKeyEventName from "./get-key-event-name";
import isEditableTarget from "./is-editable-target";
import isEventModifier from "./is-event-modifier";
import {
  type BindingDescriptor,
  type BindingInfo,
  type BindingMap,
  type Layer,
  type LayerOptions,
  LayerStack,
  type Subscription,
  type SubscriptionCallback,
} from "./layer";
import { normalizeKeyName } from "./normalize-key-name";

export type {
  BindingDescriptor,
  BindingEntry,
  BindingInfo,
  BindingMap,
  BindingOptions,
  Layer,
  LayerOptions,
  PopHandle,
  Subscription,
  SubscriptionCallback,
} from "./layer";
export { resolveBinding, toBindingOptions } from "./layer";
export { expandKeyAliases, normalizeKeyName } from "./normalize-key-name";

export type KeyboardEventName = "keydown" | "keyup";

export interface MonitorInfo {
  /** Canonical normalized key name, e.g. `shift+up` */
  keyName: string;
  /** True when a layer had a binding for this key */
  matched: boolean;
  /** Name of the winning layer, or null when nothing matched */
  layer: string | null;
  event: KeyboardEvent;
}

export type MonitorCallback = (info: MonitorInfo) => void;

export interface KeyboardistListener {
  subscribe: (
    name: string,
    callback: SubscriptionCallback,
    descriptor?: BindingDescriptor,
  ) => Subscription;
  layer: (name: string, bindings?: BindingMap, options?: LayerOptions) => Layer;
  activeLayers: () => string[];
  getBindings: () => BindingInfo[];
  setMonitor: (monitor?: MonitorCallback | boolean) => void;
  startListening: () => void;
  stopListening: () => void;
}

const defaultMonitor: MonitorCallback = ({ keyName }) => {
  console.log(":keyboard event:", keyName);
};

// Accepts both native events and React-style synthetic events
// (which keep the DOM event under `nativeEvent`).
function eventTarget(event: KeyboardEvent): unknown {
  return (
    event.target ??
    (event as { nativeEvent?: { target?: unknown } }).nativeEvent?.target
  );
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
  const layers = new LayerStack();
  let monitor: MonitorCallback | null = null;

  // ignore keystrokes while typing into form fields or contenteditable
  // regions — except when the listener is attached to such an element.
  const ignoreEditableTargets = !isEditableTarget(target);

  function handleKeyEvent(event: Event) {
    const keyboardEvent = event as KeyboardEvent;

    if (isEventModifier(keyboardEvent)) {
      return;
    }

    if (ignoreEditableTargets && isEditableTarget(eventTarget(keyboardEvent))) {
      return;
    }

    const keyName = normalizeKeyName(getKeyEventName(keyboardEvent));
    const result = layers.match(keyName);

    if (monitor) {
      monitor({
        keyName,
        matched: result.type === "match",
        layer: result.type === "match" ? result.layerName : null,
        event: keyboardEvent,
      });
    }

    if (result.type !== "match") {
      return;
    }

    keyboardEvent.preventDefault();

    // Callbacks run in LIFO order (last subscribed runs first); returning
    // false from a callback stops propagation to earlier subscriptions.
    const { listeners } = result;
    for (let i = listeners.length - 1; i >= 0; i--) {
      const propagate = listeners[i]?.(keyboardEvent);
      if (propagate === false) {
        break;
      }
    }
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

  return {
    subscribe: layers.base.subscribe,
    layer: (name, bindings, options) => layers.define(name, bindings, options),
    activeLayers: () => layers.activeLayers(),
    getBindings: () => layers.getBindings(),
    setMonitor,
    startListening,
    stopListening,
  };
}
