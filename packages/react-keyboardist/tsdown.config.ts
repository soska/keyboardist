import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  platform: "browser",
  tsconfig: "tsconfig.build.json",
  dts: true,
  sourcemap: true,
});
