import type { ReactNode } from "react";

/** Typographic primitives for the hand-ported docs prose. */

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="my-4 leading-7 text-zinc-700 dark:text-zinc-300">
      {children}
    </p>
  );
}

export function Ul({ children }: { children: ReactNode }) {
  return (
    <ul className="my-4 list-disc space-y-2 pl-6 leading-7 text-zinc-700 dark:text-zinc-300">
      {children}
    </ul>
  );
}

export function InlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.85em] text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
      {children}
    </code>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="text-zinc-900 underline hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400"
    >
      {children}
    </a>
  );
}

export function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200">
      {children}
    </div>
  );
}

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: ReactNode }) {
  return (
    <th className="border-b border-zinc-300 px-3 py-2 text-left font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100">
      {children}
    </th>
  );
}

export function Td({ children }: { children: ReactNode }) {
  return (
    <td className="border-b border-zinc-100 px-3 py-2 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300">
      {children}
    </td>
  );
}
