import { DocsLayout } from "@/components/layout/docs-layout";
import { P } from "@/components/prose";
import { usePageTitle } from "@/lib/use-page-title";
import { ElementSection } from "@/sections/core/element";
import { KeyNamesSection } from "@/sections/core/key-names";
import { LayersSection } from "@/sections/core/layers";
import { MonitorSection } from "@/sections/core/monitor";
import { MultipleListenersSection } from "@/sections/core/multiple-listeners";
import { OtherEventsSection } from "@/sections/core/other-events";
import { PrioritySection } from "@/sections/core/priority";
import { StopListeningSection } from "@/sections/core/stop-listening";
import { TypescriptSection } from "@/sections/core/typescript";
import { UsageSection } from "@/sections/core/usage";
import { UsingSupportSection } from "@/sections/core/using-support";

const sections = [
  { id: "usage", title: "Usage", Component: UsageSection },
  { id: "key-names", title: "Key names", Component: KeyNamesSection },
  {
    id: "multiple-listeners",
    title: "Multiple listeners",
    Component: MultipleListenersSection,
  },
  { id: "layers", title: "Layers", Component: LayersSection },
  { id: "priority", title: "Priority", Component: PrioritySection },
  { id: "monitor", title: "Key monitor", Component: MonitorSection },
  { id: "other-events", title: "Other events", Component: OtherEventsSection },
  {
    id: "element",
    title: "Listening on an element",
    Component: ElementSection,
  },
  {
    id: "stop-listening",
    title: "Stop listening",
    Component: StopListeningSection,
  },
  {
    id: "using-support",
    title: "using support",
    Component: UsingSupportSection,
  },
  { id: "typescript", title: "TypeScript", Component: TypescriptSection },
];

export function CorePage() {
  usePageTitle("Core");
  return (
    <DocsLayout
      title="Core"
      intro={
        <P>
          Everything the vanilla listener does — no framework required. The
          demos on this page each create their own listener, so their source
          reads exactly like the code you'd write in any app.
        </P>
      }
      sections={sections}
    />
  );
}
