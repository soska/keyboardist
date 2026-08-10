import { type ReactNode, useId, useState } from "react";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export function Tabs({
  items,
  actions,
}: {
  items: TabItem[];
  /** Rendered at the right end of the tab bar (file name, copy button…) */
  actions?: ReactNode;
}) {
  const baseId = useId();
  const [activeId, setActiveId] = useState(items[0]?.id);
  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-1 border-b border-zinc-200 bg-zinc-50 px-2 dark:border-zinc-800 dark:bg-zinc-900">
        <div role="tablist" className="flex items-center gap-1">
          {items.map((item) => (
            <button
              key={item.id}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={item.id === active.id}
              aria-controls={`${baseId}-panel-${item.id}`}
              onClick={() => setActiveId(item.id)}
              className={`border-b-2 px-3 py-2 text-sm ${
                item.id === active.id
                  ? "border-zinc-900 font-medium text-zinc-900 dark:border-zinc-100 dark:text-zinc-100"
                  : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {actions ? (
          <div className="ml-auto flex items-center gap-2 pr-1">{actions}</div>
        ) : null}
      </div>
      <div
        role="tabpanel"
        id={`${baseId}-panel-${active.id}`}
        aria-labelledby={`${baseId}-tab-${active.id}`}
      >
        {active.content}
      </div>
    </div>
  );
}
