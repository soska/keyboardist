import { useEffect } from "react";
import {
  type BindingMap,
  type KeyboardEventName,
  type KeyboardistListener,
  type Layer,
  resolveBinding,
  type Subscription,
} from "../index";
import { getSharedListener } from "./shared-listener";
import { useLatest } from "./use-latest";

export interface UseKeyBindingsOptions {
  event?: KeyboardEventName;
}

// Dependency signature for a bindings map: resubscribe only when the set of
// keys or their documentation changes, not on every inline-object identity
// change. Descriptions are captured into the layer at subscribe time, so they
// belong in the signature — otherwise an edited description would stay stale
// until the key set happened to change. NUL separator — keys themselves may
// contain commas ("j,k" aliases).
export function bindingSignatureOf(bindings: BindingMap): string {
  return Object.keys(bindings)
    .sort()
    .map((key) => {
      const binding = bindings[key];
      if (!binding) {
        return key;
      }
      const { description = "", hidden = false } = resolveBinding(binding);
      return `${key}\u0000${description}\u0000${hidden}`;
    })
    .join("\u0000");
}

/**
 * Subscribes one key of a bindings map to a layer or listener. The handler is
 * looked up through the ref on every event, so inline callbacks never force a
 * resubscribe; the description is read once, at subscribe time, which is why
 * it has to be part of the dependency signature above.
 */
export function subscribeBinding(
  target: Pick<KeyboardistListener, "subscribe"> | Layer,
  bindingsRef: { readonly current: BindingMap },
  key: string,
): Subscription {
  const binding = bindingsRef.current[key];
  const { description, hidden } = binding ? resolveBinding(binding) : {};

  return target.subscribe(
    key,
    (keyboardEvent) => {
      const current = bindingsRef.current[key];
      return current
        ? resolveBinding(current).handler(keyboardEvent)
        : undefined;
    },
    { description, hidden },
  );
}

/**
 * Subscribes a bindings map on the shared listener while the component is
 * mounted. Inline objects are fine: callbacks are read through a ref, and
 * resubscription only happens when the keys or their descriptions change.
 */
export function useKeyBindings(
  bindings: BindingMap,
  options: UseKeyBindingsOptions = {},
): void {
  const { event = "keydown" } = options;
  const bindingsRef = useLatest(bindings);
  const bindingSignature = bindingSignatureOf(bindings);

  // biome-ignore lint/correctness/useExhaustiveDependencies(bindingSignature): resubscribes when the key set or descriptions change; callbacks are read through bindingsRef
  useEffect(() => {
    const listener = getSharedListener(event);
    if (!listener) {
      return;
    }

    const subscriptions = Object.keys(bindingsRef.current).map((key) =>
      subscribeBinding(listener, bindingsRef, key),
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
    };
  }, [event, bindingSignature, bindingsRef]);
}
