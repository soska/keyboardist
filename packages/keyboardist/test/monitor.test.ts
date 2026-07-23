import { fireEvent } from "@testing-library/dom";
import { describe, expect, test, vi } from "vitest";
import { createListener, type KeyboardistListener } from "../src/index";

function createListenerOrThrow(): KeyboardistListener {
  const listener = createListener();
  if (!listener) {
    throw new Error("expected a listener in a DOM environment");
  }
  return listener;
}

describe("structured monitor", () => {
  test("reports a match with the winning layer", () => {
    const kb = createListenerOrThrow();
    const monitor = vi.fn();
    kb.subscribe("Comma", vi.fn());
    kb.setMonitor(monitor);

    fireEvent.keyDown(document, { code: "Comma", shiftKey: true });

    expect(monitor).toHaveBeenCalledTimes(1);
    const info = monitor.mock.calls[0]?.[0];
    expect(info.keyName).toBe("shift+comma");
    expect(info.matched).toBe(false);
    expect(info.layer).toBe(null);
    expect(info.event).toBeInstanceOf(KeyboardEvent);
  });

  test("reports matched=true and the layer name on a hit", () => {
    const kb = createListenerOrThrow();
    const monitor = vi.fn();
    const layer = kb.layer("monitored-layer", { Period: vi.fn() });
    layer.push();
    kb.setMonitor(monitor);

    fireEvent.keyDown(document, { code: "Period" });

    const info = monitor.mock.calls[0]?.[0];
    expect(info).toMatchObject({
      keyName: "period",
      matched: true,
      layer: "monitored-layer",
    });
  });

  test("base-layer matches report the base layer", () => {
    const kb = createListenerOrThrow();
    const monitor = vi.fn();
    kb.subscribe("Semicolon", vi.fn());
    kb.setMonitor(monitor);

    fireEvent.keyDown(document, { code: "Semicolon" });

    expect(monitor.mock.calls[0]?.[0]).toMatchObject({
      matched: true,
      layer: "base",
    });
  });

  test("an exclusive swallow reports no match", () => {
    const kb = createListenerOrThrow();
    const monitor = vi.fn();
    kb.subscribe("Quote", vi.fn());
    kb.layer("swallow-monitor", {}, { exclusive: true }).push();
    kb.setMonitor(monitor);

    fireEvent.keyDown(document, { code: "Quote" });

    expect(monitor.mock.calls[0]?.[0]).toMatchObject({
      matched: false,
      layer: null,
    });
  });

  test("setMonitor(true) uses the console monitor, setMonitor(false) clears", () => {
    const kb = createListenerOrThrow();
    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    kb.setMonitor(true);
    fireEvent.keyDown(document, { code: "BracketLeft" });
    expect(logSpy).toHaveBeenCalledWith(":keyboard event:", "bracketleft");

    kb.setMonitor(false);
    fireEvent.keyDown(document, { code: "BracketLeft" });
    expect(logSpy).toHaveBeenCalledTimes(1);

    logSpy.mockRestore();
  });
});

describe("introspection", () => {
  test("activeLayers lists names top to bottom, ending in base", () => {
    const kb = createListenerOrThrow();
    const player = kb.layer("intro-player");
    const modal = kb.layer("intro-modal");
    player.push();
    modal.push();

    expect(kb.activeLayers()).toEqual(["intro-modal", "intro-player", "base"]);

    player.pop();
    expect(kb.activeLayers()).toEqual(["intro-modal", "base"]);
  });

  test("getBindings lists bindings with their layer and active state", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("Backslash", vi.fn());
    const layer = kb.layer("intro-bindings", { "shift+Backslash": vi.fn() });

    expect(kb.getBindings()).toContainEqual({
      layer: "base",
      key: "backslash",
      active: true,
      priority: 0,
    });
    expect(kb.getBindings()).toContainEqual({
      layer: "intro-bindings",
      key: "shift+backslash",
      active: false,
      priority: 0,
    });

    layer.push();
    expect(kb.getBindings()).toContainEqual({
      layer: "intro-bindings",
      key: "shift+backslash",
      active: true,
      priority: 0,
    });
  });
});
