import { useEffect, useRef, useState } from "react";

const VISIBLE_MS = 4000;

/**
 * A brief toast reminding touch/pen users that keycaps follow a physical
 * keyboard, not their finger. Delegated to one document-level listener
 * instead of wiring every demo's keycaps individually — they all already
 * share the `.key` class, and a real mouse click is left alone since it
 * isn't the confused case this is for.
 */
export function KeycapTapHint() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        return;
      }
      if (!(event.target instanceof Element)) {
        return;
      }
      if (!event.target.closest(".key")) {
        return;
      }
      setVisible(true);
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(
        () => setVisible(false),
        VISIBLE_MS,
      );
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
    >
      <p className="flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-center text-sm text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900">
        <span aria-hidden>⌨️</span>
        That's a keycap, not a button — it lights up when you press the real key
        on a keyboard.
      </p>
    </div>
  );
}
