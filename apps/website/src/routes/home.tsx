import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DemoBlock } from "@/components/demo-block";
import { HeroKeys } from "@/components/hero-keys";
import { CopyButton } from "@/components/ui/copy-button";
import { GitHubIcon } from "@/components/ui/github-icon";
import PlayerDemo from "@/demos/player-demo";
import playerDemoSource from "@/demos/player-demo.tsx?raw";
import { usePageTitle } from "@/lib/use-page-title";

export function HomePage() {
  usePageTitle();
  return (
    <div className="py-16">
      <section className="text-center">
        <HeroKeys />
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          A declarative way to add keyboard shortcuts to your browser
          applications. Canonical key names, stackable layers, React hooks —
          zero dependencies, ~3 kB gzipped.
        </p>
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 py-1 pl-4 pr-1 font-mono text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          npm install keyboardist
          <CopyButton text="npm install keyboardist" />
        </div>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/getting-started"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Get started
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <a
            href="https://github.com/soska/keyboardist"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            <GitHubIcon className="size-4" />
            GitHub
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-center text-sm font-medium uppercase tracking-wide text-zinc-400">
          Try it — this page is listening
        </h2>
        <DemoBlock source={playerDemoSource} fileName="player-demo.tsx">
          <PlayerDemo />
        </DemoBlock>
      </section>
    </div>
  );
}
