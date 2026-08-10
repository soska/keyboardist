import {
  type BindingInfo,
  createListener,
  type KeyboardistListener,
  type Layer,
} from "keyboardist";
import { useEffect, useRef, useState } from "react";

export default function DescriptionsDemo() {
  const listenerRef = useRef<KeyboardistListener | null>(null);
  const layerRef = useRef<Layer | null>(null);
  const [bindings, setBindings] = useState<BindingInfo[]>([]);
  const [count, setCount] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    const listener = createListener();
    if (!listener) {
      return;
    }
    listenerRef.current = listener;

    // Each binding documents itself, so the sheet below is generated rather
    // than hand-maintained.
    listener.subscribe("up", () => setCount((n) => n + 1), "Adds one");
    listener.subscribe("down", () => setCount((n) => n - 1), "Subtracts one");
    listener.subscribe("KeyR", () => setCount(0), {
      description: "Resets to zero",
    });
    // The key that opens the panel is plumbing — it shouldn't list itself.
    listener.subscribe("shift+slash", () => setPanelOpen((open) => !open), {
      hidden: true,
    });

    layerRef.current = listener.layer("panel", {
      escape: {
        handler: () => setPanelOpen(false),
        description: "Closes the panel",
      },
      enter: {
        handler: () => setPanelOpen(false),
        description: "Confirms and closes",
      },
    });

    setBindings(listener.getBindings());

    return () => {
      layerRef.current?.dispose();
      listener.stopListening();
      listenerRef.current = null;
      layerRef.current = null;
    };
  }, []);

  // Push or pop the panel's layer, then re-read the sheet — `active` flips
  // with the stack, so the listing follows along on its own.
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    if (panelOpen) {
      layer.push();
    } else {
      layer.pop();
    }
    setBindings(listenerRef.current?.getBindings() ?? []);
  }, [panelOpen]);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Press <kbd>↑</kbd> <kbd>↓</kbd> <kbd>R</kbd> to change the count, and{" "}
        <kbd>?</kbd> to open the panel — watch its bindings go active.
      </p>
      <p className="mt-3 font-mono text-2xl text-zinc-800 dark:text-zinc-200">
        {count}
      </p>
      {panelOpen ? (
        <p className="mt-2 rounded-lg bg-zinc-100 p-3 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
          Panel is open — <kbd>Esc</kbd> or <kbd>Enter</kbd> closes it.
        </p>
      ) : null}
      <table className="mt-3 w-full text-left font-mono text-sm">
        <tbody>
          {bindings.map((binding) => (
            <tr
              key={`${binding.layer}:${binding.key}`}
              className={binding.active ? undefined : "opacity-40"}
            >
              <td className="py-1 pr-4 text-zinc-500">{binding.layer}</td>
              <td className="py-1 pr-4 text-zinc-800 dark:text-zinc-200">
                {binding.key}
              </td>
              <td className="py-1 text-zinc-600 dark:text-zinc-400">
                {binding.description ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-2 text-xs text-zinc-500">
        Dimmed rows are bindings that exist but aren't reachable right now. The{" "}
        <code>shift+slash</code> binding that opens the panel is marked{" "}
        <code>hidden</code>, so it never appears at all.
      </p>
    </div>
  );
}
