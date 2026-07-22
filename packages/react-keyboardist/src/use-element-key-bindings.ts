import {
  type BindingMap,
  createListener,
  type KeyboardEventName,
} from "keyboardist";
import { type RefObject, useEffect } from "react";
import { keySignatureOf } from "./use-key-bindings";
import { useLatest } from "./use-latest";

export interface UseElementKeyBindingsOptions {
  event?: KeyboardEventName;
}

/**
 * Attaches a dedicated listener to the element in `ref` — bindings keep
 * firing while the user types into it (unlike the shared listener, which
 * ignores keystrokes in editable elements).
 */
export function useElementKeyBindings(
  ref: RefObject<Element | null>,
  bindings: BindingMap,
  options: UseElementKeyBindingsOptions = {},
): void {
  const { event = "keydown" } = options;
  const bindingsRef = useLatest(bindings);
  const keySignature = keySignatureOf(bindings);

  // biome-ignore lint/correctness/useExhaustiveDependencies(keySignature): resubscribes when the key set changes; callbacks are read through bindingsRef
  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const listener = createListener(event, element);
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
      listener.stopListening();
    };
  }, [ref, event, keySignature, bindingsRef]);
}
