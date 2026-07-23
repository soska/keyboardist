import type { MonitorCallback } from "keyboardist";
import {
  KeyboardLayer,
  useKeyBindings,
  useKeyMonitor,
} from "keyboardist/react";
import { useState } from "react";
import { createRoot } from "react-dom/client";

function ReactModal({ onClose }: { onClose: () => void }) {
  return (
    <KeyboardLayer bindings={{ escape: onClose }} exclusive>
      <div className="layer-modal open">
        <div className="layer-modal-box">
          <h3>React modal layer</h3>
          <p>
            This modal is a React component wrapped in{" "}
            <code>&lt;KeyboardLayer exclusive&gt;</code>. The vanilla player
            keys above are inert right now — same listener, same stack. Press{" "}
            <strong>Esc</strong> to close.
          </p>
        </div>
      </div>
    </KeyboardLayer>
  );
}

function ReactDemo({ onMonitor }: { onMonitor?: MonitorCallback }) {
  const [count, setCount] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastKey, setLastKey] = useState<string>("—");

  useKeyBindings({
    "shift+r": () => setCount((current) => current + 1),
  });

  // The listener has a single monitor slot; this island takes it over and
  // keeps the vanilla monitor display fed via onMonitor.
  useKeyMonitor((info) => {
    const { keyName, matched, layer } = info;
    setLastKey(matched ? `${keyName} → "${layer}"` : `${keyName} (no match)`);
    onMonitor?.(info);
  });

  return (
    <div className="react-demo-panel">
      <p>
        Counter: <strong>{count}</strong> — press <code>shift+R</code> to
        increment (bound with <code>useKeyBindings</code>).
      </p>
      <p>
        Last key: <code>{lastKey}</code> (via <code>useKeyMonitor</code>)
      </p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => setModalOpen(true)}
      >
        Open React modal
      </button>
      {modalOpen && <ReactModal onClose={() => setModalOpen(false)} />}
    </div>
  );
}

export function mountReactDemo(
  element: Element,
  options: { onMonitor?: MonitorCallback } = {},
) {
  createRoot(element).render(<ReactDemo onMonitor={options.onMonitor} />);
}
