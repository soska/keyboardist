import {
  createListener,
  type KeyboardEventName,
  type KeyboardistListener,
} from "../index";

// Lazily-created shared listeners, one per event type. Creation only ever
// happens inside effects (client-side), never at module scope, so importing
// this package is safe in server environments (SSR / React Server
// Components).
const cache = new Map<KeyboardEventName, KeyboardistListener | false>();

export function getSharedListener(
  event: KeyboardEventName = "keydown",
): KeyboardistListener | false {
  let listener = cache.get(event);
  if (listener === undefined) {
    listener = createListener(event);
    cache.set(event, listener);
  }
  return listener;
}
