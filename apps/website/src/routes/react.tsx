import { DocsLayout } from "@/components/layout/docs-layout";
import { InlineCode, P } from "@/components/prose";
import { usePageTitle } from "@/lib/use-page-title";
import { ComponentsSection } from "@/sections/react/components";
import { HooksSection } from "@/sections/react/hooks";
import { NestingSection } from "@/sections/react/nesting";
import { OverviewSection } from "@/sections/react/overview";

const sections = [
  { id: "overview", title: "Overview & SSR", Component: OverviewSection },
  { id: "hooks", title: "Hooks", Component: HooksSection },
  { id: "components", title: "Components", Component: ComponentsSection },
  { id: "nesting", title: "Nesting is priority", Component: NestingSection },
];

export function ReactPage() {
  usePageTitle("React");
  return (
    <DocsLayout
      title="React"
      intro={
        <P>
          Hooks and components over the same core listener, imported from{" "}
          <InlineCode>keyboardist/react</InlineCode>. The demos on this page all
          share one listener and one layer stack — exactly how they'd coexist in
          a real app.
        </P>
      }
      sections={sections}
    />
  );
}
