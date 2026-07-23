import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Resolve the workspace package to its source so the demo hot-reloads
    // library changes without a build step. Most-specific alias first.
    alias: [
      {
        find: "keyboardist/react",
        replacement: fileURLToPath(
          new URL(
            "../../packages/keyboardist/src/react/index.ts",
            import.meta.url,
          ),
        ),
      },
      {
        find: "keyboardist",
        replacement: fileURLToPath(
          new URL("../../packages/keyboardist/src/index.ts", import.meta.url),
        ),
      },
    ],
  },
});
