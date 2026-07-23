// @vitest-environment node
// The RSC contract: this module must be importable in a server
// environment (no window, no DOM) without throwing.
import { describe, expect, test } from "vitest";
import * as ReactKeyboardist from "../src/index";

describe("server-side import safety", () => {
  test("module imports without a DOM and exposes the API", () => {
    expect(ReactKeyboardist.useKeyBindings).toBeTypeOf("function");
    expect(ReactKeyboardist.useKeyboardLayer).toBeTypeOf("function");
    expect(ReactKeyboardist.useKeyMonitor).toBeTypeOf("function");
    expect(ReactKeyboardist.useElementKeyBindings).toBeTypeOf("function");
    expect(ReactKeyboardist.Keyboardist).toBeTypeOf("function");
    expect(ReactKeyboardist.KeyboardLayer).toBeTypeOf("function");
    expect(ReactKeyboardist.KeyboardInput).toBeDefined();
    expect(ReactKeyboardist.default).toBe(ReactKeyboardist.Keyboardist);
  });
});
