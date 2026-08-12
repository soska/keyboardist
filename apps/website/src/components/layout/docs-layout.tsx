import type { ComponentType, ReactNode } from "react";

export interface DocSection {
  id: string;
  title: string;
  Component: ComponentType;
}

/**
 * Docs page shell: sidebar TOC built from the section manifest, and one
 * anchored <section> per entry. Promoting a section to its own page later
 * is just moving its manifest entry into the router.
 */
export function DocsLayout({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: ReactNode;
  sections: DocSection[];
}) {
  return (
    // timeline-scope lifts each section's view timeline up here so the TOC
    // links (in a sibling subtree) can drive their highlight animation off it.
    <div
      className="flex gap-10 py-10"
      style={{ timelineScope: sections.map((s) => `--toc-${s.id}`).join(", ") }}
    >
      <aside className="hidden w-48 shrink-0 lg:block">
        <nav className="sticky top-20 space-y-1 text-sm  pl-1">
          <p className="mb-2 font-medium text-zinc-900 dark:text-zinc-100 px-2 ">
            On this page
          </p>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="toc-link block py-1 px-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-sm transition-colors duration-200"
              style={{ animationTimeline: `--toc-${section.id}` }}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 pb-16">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        {intro}
        {sections.map(({ id, title: sectionTitle, Component }) => (
          <section
            key={id}
            id={id}
            className="docs-section scroll-mt-20"
            style={{ viewTimelineName: `--toc-${id}` }}
          >
            <h2 className="group mt-12 mb-4 border-b border-zinc-100 pb-2 text-2xl font-semibold text-zinc-900 dark:border-zinc-800 dark:text-zinc-100">
              {sectionTitle}{" "}
              <a
                href={`#${id}`}
                className="text-zinc-300 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600"
                aria-label={`Link to ${sectionTitle}`}
              >
                #
              </a>
            </h2>
            <Component />
          </section>
        ))}
      </div>
    </div>
  );
}
