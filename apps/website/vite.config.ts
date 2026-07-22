import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolve the workspace packages to their source so the demo
      // hot-reloads library changes without a build step.
      "react-keyboardist": fileURLToPath(
        new URL(
          "../../packages/react-keyboardist/src/index.ts",
          import.meta.url,
        ),
      ),
      keyboardist: fileURLToPath(
        new URL("../../packages/keyboardist/src/index.ts", import.meta.url),
      ),
    },
  },
});
