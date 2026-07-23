import type { BindingMap, KeyboardEventName } from "keyboardist";
import { useEffect } from "react";
import { getSharedListener } from "./shared-listener";
import { useLatest } from "./use-latest";

export interface UseKeyBindingsOptions {
  event?: KeyboardEventName;
}

// Dependency signature for a bindings map: resubscribe only when the set of
// keys changes, not on every inline-object identity change. NUL separator —
// keys themselves may contain commas ("j,k" aliases).
export function keySignatureOf(bindings: BindingMap): string {
  return Object.keys(bindings).sort().join("\u0000");
}

/**
 * Subscribes a bindings map on the shared listener while the component is
 * mounted. Inline objects are fine: callbacks are read through a ref, and
 * resubscription only happens when the set of keys changes.
 */
export function useKeyBindings(
  bindings: BindingMap,
  options: UseKeyBindingsOptions = {},
): void {
  const { event = "keydown" } = options;
  const bindingsRef = useLatest(bindings);
  const keySignature = keySignatureOf(bindings);

  // biome-ignore lint/correctness/useExhaustiveDependencies(keySignature): resubscribes when the key set changes; callbacks are read through bindingsRef
  useEffect(() => {
    const listener = getSharedListener(event);
    if (!listener) {
      return;
    }

    const subscriptions = Object.keys(bindingsRef.current).map((key) =>
      listener.subscribe(key, (keyboardEvent) =>
        bindingsRef.current[key]?.(keyboardEvent),
      ),
    );

    return () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
    };
  }, [event, keySignature, bindingsRef]);
}
