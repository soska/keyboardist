import { createListener } from "keyboardist";
import { useEffect, useState } from "react";
import "@/styles/demo.css";

export default function KeyupDemo() {
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const down = createListener(); // keydown by default
    const up = createListener("keyup");
    if (!down || !up) {
      return;
    }

    down.subscribe("a", () => setHeld(true));
    up.subscribe("a", () => setHeld(false));

    return () => {
      down.stopListening();
      up.stopListening();
    };
  }, []);

  return (
    <div className="text-center">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Hold the <kbd>A</kbd> key — a keydown listener presses the button, a
        keyup listener releases it.
      </p>
      <div className="key-rows">
        <div className="keys">
          <div className={held ? "key pressed" : "key"}>A</div>
        </div>
      </div>
    </div>
  );
}
