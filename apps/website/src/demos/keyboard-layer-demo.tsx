import { KeyboardLayer } from "keyboardist/react";
import { useState } from "react";
import "@/styles/demo.css";

export default function KeyboardLayerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        The modal is wrapped in <code>&lt;KeyboardLayer exclusive&gt;</code> —
        while it's mounted, it owns the keyboard.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mx-auto mt-3 block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Open modal
      </button>
      {open && (
        <KeyboardLayer
          name="react-modal"
          bindings={{ escape: () => setOpen(false) }}
          exclusive
        >
          <div className="layer-modal">
            <div className="layer-modal-box">
              <h3 className="text-lg font-semibold">React modal layer</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Every other shortcut on this page is inert right now. Press{" "}
                <strong>Esc</strong> to close.
              </p>
            </div>
          </div>
        </KeyboardLayer>
      )}
    </div>
  );
}
