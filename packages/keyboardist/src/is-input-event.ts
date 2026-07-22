import isInputElement from "./is-input-element";

// Accepts both native events and React-style synthetic events
// (which keep the DOM event under `nativeEvent`).
interface EventLike {
  target?: unknown;
  nativeEvent?: { target?: unknown };
}

const isInputEvent = (event: EventLike): boolean => {
  return isInputElement(event.target ?? event.nativeEvent?.target);
};

export default isInputEvent;
