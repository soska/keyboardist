import {
  KeyboardLayer,
  useKeyBindings,
  useKeyboardLayer,
  useKeyMonitor,
} from "keyboardist/react";
import { useEffect, useRef, useState } from "react";
import "@/styles/demo.css";

const KEY_ROWS = [
  {
    id: "movement",
    keys: [
      { id: "space", label: "Space" },
      { id: "up", label: "Up" },
      { id: "down", label: "Down" },
      { id: "left", label: "Left" },
      { id: "right", label: "Right" },
    ],
  },
  {
    id: "combos",
    keys: [
      { id: "shift+space", label: "Shift+Space" },
      { id: "meta+space", label: "Meta+Space" },
      { id: "escape", label: "Esc" },
    ],
  },
];

const ALL_KEYS = KEY_ROWS.flatMap((row) => row.keys);

const PRESS_ANY_KEY_HEADING = "press a key, any key";

export default function PlayerDemo() {
  const { pressed, press } = usePressedKeys();
  const [monitor, setMonitor] = useState({
    heading: PRESS_ANY_KEY_HEADING,
    detail: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const resetRef = useRef<number | undefined>(undefined);

  // Every key above gets a binding on a layer named "player".
  useKeyboardLayer(
    Object.fromEntries(ALL_KEYS.map(({ id }) => [id, () => press(id)])),
    { name: "player" },
  );

  // A base-layer binding, below the player layer.
  useKeyBindings({ m: () => setModalOpen(true) });

  // The monitor observes every key event and names the winning layer.
  useKeyMonitor(({ keyName, matched, layer }) => {
    window.clearTimeout(resetRef.current);
    setMonitor({
      heading: keyName,
      detail: matched ? `matched in "${layer}"` : "no match",
    });
    resetRef.current = window.setTimeout(() => {
      setMonitor({ heading: PRESS_ANY_KEY_HEADING, detail: "" });
    }, 1200);
  });

  return (
    <div>
      <div className="text-3xl font-semibold text-zinc-400 flex align-baseline justify-center py-3">
        {monitor.heading}
        <small>{monitor.detail || " "}</small>
      </div>
      <div className="key-rows">
        {KEY_ROWS.map((row) => (
          <div key={row.id} className="keys">
            {row.keys.map(({ id, label }) => (
              <div key={id} className={pressed[id] ? "key pressed" : "key"}>
                {label}
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Press <kbd>M</kbd> (or the button) to open a modal on an{" "}
        <em>exclusive</em> layer — it takes the whole keyboard until{" "}
        <kbd>Esc</kbd> closes it.
      </p>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mx-auto mt-3 block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Open modal (M)
      </button>
      {modalOpen && (
        <KeyboardLayer
          name="modal"
          bindings={{ escape: () => setModalOpen(false) }}
          exclusive
        >
          <div className="layer-modal">
            <div className="layer-modal-box">
              <h3 className="text-lg font-semibold">Modal layer</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Try the player keys — nothing happens, and the monitor says "no
                match". Press <strong>Esc</strong> to close.
              </p>
            </div>
          </div>
        </KeyboardLayer>
      )}
    </div>
  );
}

/** Marks a key as pressed for a moment, like a real key plunger. */
function usePressedKeys(duration = 150) {
  const [pressed, setPressed] = useState<Record<string, boolean>>({});
  const timeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    const pending = timeouts.current;
    return () => {
      for (const id of Object.values(pending)) {
        window.clearTimeout(id);
      }
    };
  }, []);

  const press = (id: string) => {
    setPressed((current) => ({ ...current, [id]: true }));
    window.clearTimeout(timeouts.current[id]);
    timeouts.current[id] = window.setTimeout(() => {
      setPressed((current) => ({ ...current, [id]: false }));
    }, duration);
  };

  return { pressed, press };
}
