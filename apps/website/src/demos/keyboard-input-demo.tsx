import { KeyboardInput } from "keyboardist/react";
import { useState } from "react";

export default function KeyboardInputDemo() {
  const [value, setValue] = useState(0);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        <code>&lt;KeyboardInput&gt;</code> renders an input with its own
        attached listener — focus it and press <kbd>↑</kbd> / <kbd>↓</kbd>.
      </p>
      <KeyboardInput
        bindings={{
          up: () => setValue((current) => current + 1),
          down: () => setValue((current) => current - 1),
        }}
        value={value}
        readOnly
        className="mt-3 block w-full rounded-lg border border-zinc-300 px-3 py-2 font-mono text-lg dark:border-zinc-700 dark:bg-zinc-900"
      />
    </div>
  );
}
