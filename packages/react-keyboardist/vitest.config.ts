import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      // Test against keyboardist source so no build step is needed.
      keyboardist: fileURLToPath(
        new URL("../keyboardist/src/index.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
  },
});
