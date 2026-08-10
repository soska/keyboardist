import { type RefObject, useEffect, useState } from "react";
import {
  type BindingMap,
  createListener,
  type KeyboardEventName,
} from "../index";
import { bindingSignatureOf, subscribeBinding } from "./use-key-bindings";
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
  const bindingSignature = bindingSignatureOf(bindings);
  const [element, setElement] = useState<Element | null>(null);

  useEffect(() => {
    if (element !== ref.current) {
      setElement(ref.current);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies(bindingSignature): resubscribes when the key set or descriptions change; callbacks are read through bindingsRef
  useEffect(() => {
    if (!element) {
      return;
    }
    const listener = createListener(event, element);
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
      listener.stopListening();
    };
  }, [element, event, bindingSignature, bindingsRef]);
}
