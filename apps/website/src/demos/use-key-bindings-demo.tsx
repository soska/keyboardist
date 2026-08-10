import { useKeyBindings } from "keyboardist/react";
import { useState } from "react";

export default function UseKeyBindingsDemo() {
  const [count, setCount] = useState(0);

  // Global bindings for the component's lifetime. Inline objects are
  // fine — resubscription only happens when the set of keys changes.
  useKeyBindings({
    "shift+r": () => setCount((current) => current + 1),
    "shift+e": () => setCount(0),
  });

  return (
    <p className="text-center text-zinc-700 dark:text-zinc-300">
      Counter: <strong className="font-mono text-lg">{count}</strong> — press{" "}
      <kbd>Shift+R</kbd> to increment, <kbd>Shift+E</kbd> to reset.
    </p>
  );
}
