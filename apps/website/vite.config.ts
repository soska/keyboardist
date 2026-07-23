import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
