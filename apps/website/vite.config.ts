import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      // Resolve the workspace package to its source so the demo
      // hot-reloads library changes without a build step.
      keyboardist: fileURLToPath(
        new URL("../../packages/keyboardist/src/index.ts", import.meta.url),
      ),
    },
  },
});
