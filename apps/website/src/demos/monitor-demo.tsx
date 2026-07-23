import { createListener } from "keyboardist";
import { useEffect, useState } from "react";

interface MonitorReadout {
  keyName: string;
  matched: boolean;
  layer: string | null;
}

export default function MonitorDemo() {
  const [readout, setReadout] = useState<MonitorReadout | null>(null);

  useEffect(() => {
    const kb = createListener();
    if (!kb) {
      return;
    }

    // Give the monitor something to match…
    kb.subscribe("k", () => {});
    const examples = kb.layer("examples", { "shift+k": () => {} });
    examples.push();

    // …and observe every key event with a structured payload.
    kb.setMonitor(({ keyName, matched, layer }) => {
      setReadout({ keyName, matched, layer });
    });

    return () => kb.stopListening();
  }, []);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Press any key — this listener only binds <kbd>K</kbd> (base) and{" "}
        <kbd>Shift+K</kbd> (a layer named <code>examples</code>), so watch{" "}
        <code>matched</code> and <code>layer</code> change.
      </p>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-sm">
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-xs text-zinc-400">keyName</div>
          {readout ? readout.keyName : "—"}
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-xs text-zinc-400">matched</div>
          {readout ? String(readout.matched) : "—"}
        </div>
        <div className="rounded-lg bg-zinc-100 p-3 dark:bg-zinc-900">
          <div className="text-xs text-zinc-400">layer</div>
          {readout ? (readout.layer ?? "null") : "—"}
        </div>
      </div>
    </div>
  );
}
