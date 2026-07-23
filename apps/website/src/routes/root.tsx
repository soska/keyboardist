import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { to: "/getting-started", label: "Getting started" },
  { to: "/core", label: "Core" },
  { to: "/react", label: "React" },
] as const;

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
          <Link
            to="/"
            className="font-semibold text-zinc-900 dark:text-zinc-100"
          >
            🎹 Keyboardist
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {navigation.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                activeProps={{
                  className: "font-medium text-zinc-900 dark:text-zinc-100",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <a
            href="https://github.com/soska/keyboardist"
            className="ml-auto text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-200 py-8 dark:border-zinc-800 text-center text-sm text-zinc-500">
        MIT ·{" "}
        <a
          href="https://github.com/soska/keyboardist"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Keyboardist
        </a>{" "}
        by{" "}
        <a
          href="https://armandososa.org"
          className="underline hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          Armando Sosa
        </a>
      </footer>
    </div>
  );
}

export function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl">🎹</p>
      <h1 className="mt-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        Page not found
      </h1>
      <p className="mt-2 text-zinc-500">
        That route doesn't match any binding.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        Back home
      </Link>
    </div>
  );
}
