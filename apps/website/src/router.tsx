import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { CorePage } from "@/routes/core";
import { GettingStartedPage } from "@/routes/getting-started";
import { HomePage } from "@/routes/home";
import { ReactPage } from "@/routes/react";
import { NotFound, RootLayout } from "@/routes/root";

const rootRoute = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const gettingStartedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/getting-started",
  component: GettingStartedPage,
});

const coreRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/core",
  component: CorePage,
});

const reactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/react",
  component: ReactPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  gettingStartedRoute,
  coreRoute,
  reactRoute,
]);

export const router = createRouter({
  routeTree,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
