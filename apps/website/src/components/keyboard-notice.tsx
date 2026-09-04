import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTouchOnly } from "@/lib/use-touch-only";

const DISMISSED_KEY = "keyboardist:keyboard-notice-dismissed";

/**
 * A dismissible bar shown only on devices that look keyboardless (touch,
 * no hover) — every demo on the site drives off real key events, and
 * without this the gold keycaps just look like unresponsive buttons.
 * Dismissal is remembered in localStorage so it only has to be said once.
 */
export function KeyboardNotice() {
  const touchOnly = useTouchOnly();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === "1");
  }, []);

  if (!touchOnly || dismissed) {
    return null;
  }

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="border-b border-yellow-200 bg-yellow-50 px-4 py-2 text-sm text-yellow-900 dark:border-yellow-500/20 dark:bg-yellow-500/10 dark:text-yellow-200">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3">
        <span aria-hidden>⌨️</span>
        <p className="flex-1">
          Keyboardist's demos need a physical keyboard to try — they won't
          respond to taps. Best viewed on a desktop or laptop.
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded p-1 text-yellow-700 hover:bg-yellow-100 dark:text-yellow-300 dark:hover:bg-yellow-500/10"
        >
          <X aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
