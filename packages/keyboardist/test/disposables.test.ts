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

describe("explicit resource management", () => {
  test("disposing a subscription unsubscribes it", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const subscription = kb.subscribe("Digit7", callback);

    subscription[Symbol.dispose]();
    fireEvent.keyDown(document, { code: "Digit7" });
    expect(callback).not.toHaveBeenCalled();
  });

  test("disposing a push handle pops the layer", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const layer = kb.layer("disposable-push", { Digit8: callback });

    const handle = layer.push();
    handle[Symbol.dispose]();

    expect(layer.isActive()).toBe(false);
    fireEvent.keyDown(document, { code: "Digit8" });
    expect(callback).not.toHaveBeenCalled();
  });

  test("double dispose is a no-op", () => {
    const kb = createListenerOrThrow();
    const layer = kb.layer("double-dispose", { Digit9: vi.fn() });

    const handle = layer.push();
    handle();
    expect(() => handle[Symbol.dispose]()).not.toThrow();

    const subscription = kb.subscribe("Digit9", vi.fn());
    subscription.unsubscribe();
    expect(() => subscription[Symbol.dispose]()).not.toThrow();
  });
});
