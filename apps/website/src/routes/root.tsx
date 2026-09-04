import { Link, Outlet } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { KeyboardNotice } from "@/components/keyboard-notice";
import { KeycapTapHint } from "@/components/keycap-tap-hint";
import { GitHubIcon } from "@/components/ui/github-icon";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navigation = [
  { to: "/getting-started", label: "Getting started" },
  { to: "/core", label: "Core" },
  { to: "/react", label: "React" },
] as const;

export function RootLayout() {
  // Below `md` the nav links + GitHub link don't fit next to the logo and
  // theme toggle without crushing everything — they move into this panel
  // instead, toggled from a hamburger button in the header.
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const closeMobileNav = () => setMobileNavOpen(false);

  return (
    <div className="flex min-h-screen flex-col">
      <KeyboardNotice />
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-6 px-4">
          <Link
            to="/"
            onClick={closeMobileNav}
            className="font-semibold text-zinc-900 dark:text-zinc-100"
          >
            🎹 Keyboardist
          </Link>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navigation.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-300  px-2 py-2.5 border-b-4 border-transparent hover:border-yellow-200 dark:hover:border-yellow-500 transition-colors duration-200"
                activeProps={{
                  className:
                    "font-medium text-zinc-900 dark:text-zinc-100 border-yellow-200 dark:border-yellow-500",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <a
              href="https://github.com/soska/keyboardist"
              className="hidden items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 md:inline-flex"
            >
              <GitHubIcon className="size-3.5" />
              GitHub
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileNavOpen}
              className="rounded-md p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            >
              {mobileNavOpen ? (
                <X aria-hidden className="size-5" />
              ) : (
                <Menu aria-hidden className="size-5" />
              )}
            </button>
          </div>
        </div>
        {mobileNavOpen && (
          <nav className="border-t border-zinc-200 dark:border-zinc-800 md:hidden">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3">
              {navigation.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileNav}
                  className="rounded-md px-3 py-2 text-sm text-zinc-700 dark:text-zinc-400"
                  activeProps={{
                    className:
                      "font-medium bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100",
                  }}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://github.com/soska/keyboardist"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-zinc-500 dark:text-zinc-400"
              >
                <GitHubIcon className="size-3.5" />
                GitHub
              </a>
            </div>
          </nav>
        )}
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
      <KeycapTapHint />
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
