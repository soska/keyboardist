import { createListener } from "keyboardist";
import { useEffect, useRef, useState } from "react";

export default function ElementInputDemo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) {
      return;
    }

    // A listener attached to the element itself — it keeps receiving
    // keys even though form elements are ignored by default.
    const kb = createListener("keydown", input);
    if (!kb) {
      return;
    }

    kb.subscribe("up", () => setValue((current) => current + 1));
    kb.subscribe("down", () => setValue((current) => current - 1));
    kb.subscribe("escape", () => setValue(0));

    return () => kb.stopListening();
  }, []);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Focus the input, then press <kbd>↑</kbd> / <kbd>↓</kbd> to change the
        value — <kbd>Esc</kbd> resets it.
      </p>
      <input
        ref={inputRef}
        value={value}
        readOnly
        className="mt-3 block w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-lg dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
