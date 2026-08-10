import { KeyboardLayer } from "keyboardist/react";
import { type ReactNode, useState } from "react";

function Box({
  label,
  onClose,
  children,
}: {
  label: string;
  onClose: () => void;
  children?: ReactNode;
}) {
  return (
    <KeyboardLayer name={label} bindings={{ escape: onClose }}>
      <div className="mt-3 rounded-lg border-2 border-amber-300 bg-amber-50/60 p-4 text-left dark:border-amber-500/40 dark:bg-amber-950/30">
        <p className="font-mono text-sm text-zinc-700 dark:text-zinc-300">
          {label} — <kbd>Esc</kbd> closes me
        </p>
        {children}
      </div>
    </KeyboardLayer>
  );
}

export default function NestingDemo() {
  const [depth, setDepth] = useState(3);

  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Three nested layers all bind <kbd>Esc</kbd>. The <em>innermost</em> one
        wins — JSX nesting is the priority.
      </p>
      {depth === 0 ? (
        <button
          type="button"
          onClick={() => setDepth(3)}
          className="mt-3 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Open all three
        </button>
      ) : (
        <Box label="outer" onClose={() => setDepth(0)}>
          {depth >= 2 && (
            <Box label="middle" onClose={() => setDepth(1)}>
              {depth >= 3 && <Box label="inner" onClose={() => setDepth(2)} />}
            </Box>
          )}
        </Box>
      )}
    </div>
  );
}
