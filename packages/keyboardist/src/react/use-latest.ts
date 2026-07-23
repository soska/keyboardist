import { type RefObject, useRef } from "react";

// Keeps a ref pointing at the latest value so stable subscription wrappers
// always call the current callback — inline objects and closures from the
// latest render just work, without resubscribing on every render.
export function useLatest<T>(value: T): RefObject<T> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}
