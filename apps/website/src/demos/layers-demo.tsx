import { createListener, type Layer } from "keyboardist";
import { useEffect, useRef, useState } from "react";
import "@/styles/demo.css";

export default function LayersDemo() {
  const [lastAction, setLastAction] = useState("—");
  const [modalOpen, setModalOpen] = useState(false);
  const modalLayerRef = useRef<Layer | null>(null);

  useEffect(() => {
    const kb = createListener();
    if (!kb) {
      return;
    }

    // A named layer registered as a map; pushed = live.
    const game = kb.layer("game", {
      g: () => setLastAction('"g" — matched in the "game" layer'),
      o: () => setModalOpen(true),
    });
    game.push();

    // An exclusive layer: while it's on top, unmatched keys go inert
    // instead of falling through — the "game" bindings above go dead.
    modalLayerRef.current = kb.layer(
      "modal",
      { escape: () => setModalOpen(false) },
      { exclusive: true },
    );

    return () => kb.stopListening();
  }, []);

  // Push the modal layer while the modal is open; the pop handle
  // restores everything below it.
  useEffect(() => {
    if (!modalOpen) {
      return;
    }
    const pop = modalLayerRef.current?.push();
    return () => pop?.();
  }, [modalOpen]);

  return (
    <div className="text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Press <kbd>G</kbd> to trigger the game layer, <kbd>O</kbd> (or the
        button) to let an exclusive modal layer take the keyboard.
      </p>
      <p className="mt-3 font-mono text-sm text-zinc-800 dark:text-zinc-200">
        {lastAction}
      </p>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="mx-auto mt-3 block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Open modal (O)
      </button>
      {modalOpen && (
        <div className="layer-modal">
          <div className="layer-modal-box">
            <h3 className="text-lg font-semibold">Exclusive modal layer</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Try <kbd>G</kbd> — nothing happens while this layer owns the
              keyboard. Press <strong>Esc</strong> to close.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
