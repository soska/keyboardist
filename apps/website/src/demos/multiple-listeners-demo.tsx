import { createListener } from "keyboardist";
import { useEffect, useState } from "react";

export default function MultipleListenersDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [stopEarly, setStopEarly] = useState(false);

  useEffect(() => {
    const listener = createListener();
    if (!listener) {
      return;
    }

    const logLine = (line: string) =>
      setLog((current) => [...current.slice(-4), line]);

    // Handlers run last-subscribed first: C, then B, then A.
    const subscriptions = [
      listener.subscribe("space", () => logLine("A — subscribed first")),
      listener.subscribe("space", () => logLine("B")),
      listener.subscribe("space", () => {
        logLine(
          stopEarly
            ? "C — returned false, so B and A never run"
            : "C — subscribed last, runs first",
        );
        // returning false stops the earlier handlers
        return stopEarly ? false : undefined;
      }),
    ];

    return () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
      listener.stopListening();
    };
  }, [stopEarly]);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Press <kbd>Space</kbd> — three handlers share the key.
      </p>
      <label className="mt-2 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
        <input
          type="checkbox"
          checked={stopEarly}
          onChange={(event) => setStopEarly(event.target.checked)}
        />
        return <code>false</code> from C to stop propagation
      </label>
      <pre className="mt-3 min-h-24 rounded-lg bg-zinc-100 p-3 font-mono text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        {log.length > 0 ? log.join("\n") : "…"}
      </pre>
    </div>
  );
}
