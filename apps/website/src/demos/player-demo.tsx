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
  const [monitor, setMonitor] = useState<{
    heading: string;
    matched?: boolean;
  }>({ heading: PRESS_ANY_KEY_HEADING });
  const [modalOpen, setModalOpen] = useState(false);
  const resetRef = useRef<number | undefined>(undefined);

  // Every key above gets a binding on a layer named "player".
  useKeyboardLayer(
    Object.fromEntries(ALL_KEYS.map(({ id }) => [id, () => press(id)])),
    { name: "player" }
  );

  // A base-layer binding, below the player layer.
  useKeyBindings({ m: () => setModalOpen(true) });

  // The monitor observes every key event; matched keys read dark, misses faint.
  useKeyMonitor(({ keyName, matched }) => {
    window.clearTimeout(resetRef.current);
    setMonitor({ heading: keyName, matched });
    resetRef.current = window.setTimeout(() => {
      setMonitor({ heading: PRESS_ANY_KEY_HEADING });
    }, 1200);
  });

  const headingColor =
    monitor.matched === undefined
      ? "text-zinc-500"
      : monitor.matched
      ? "text-zinc-800 dark:text-zinc-100"
      : "text-zinc-400 dark:text-zinc-800";

  return (
    <div>
      <div
        className={`text-3xl font-semibold flex align-baseline justify-center py-3 ${headingColor}`}
      >
        {monitor.heading}
      </div>
      <div className="key-rows my-6">
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
      <div className="flex flex-col gap-2 items-center bg-gray-50 dark:bg-zinc-900 p-6 rounded-md">
        <p className="mt-2 text-center text-sm dark:text-zinc-400 mb-2">
          Press <kbd>M</kbd> (or the button) to open a modal on an{" "}
          <em>exclusive</em> layer — it takes the whole keyboard until{" "}
          <kbd>Esc</kbd> closes it.
        </p>
        <div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex justify-center items-center gap-1 rounded-lg bg-zinc-900 dark:bg-zinc-200 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Open modal
            <span className="text-white/80 font-regular font-bold text-xs bg-white/10 p-0.5">
              M
            </span>
          </button>
        </div>
      </div>
      {modalOpen && (
        <KeyboardLayer
          name="modal"
          bindings={{ escape: () => setModalOpen(false) }}
          exclusive
        >
          <div className="layer-modal">
            <div className="layer-modal-box">
              <h3 className="text-lg font-bold border-b border-b-zinc-500 -mt-4 pb-3 mb-2">
                You've opened a Modal
              </h3>
              <p className="mt-2 text-sm text-zinc-600">
                While you're here, all the other shortcut keys are disabled.
                This is because the modal has it's own layer that gets activated
                when it's opened and disabled when dismissed.
              </p>
              <p className="mt-2 text-sm text-zinc-600">
                Press <strong>Esc</strong> to close.
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
