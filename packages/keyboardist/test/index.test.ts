import { fireEvent } from "@testing-library/dom";
import { describe, expect, test, vi } from "vitest";
import { createListener } from "../src/index";

function createListenerOrThrow(
  ...args: Parameters<typeof createListener>
): Exclude<ReturnType<typeof createListener>, false> {
  const listener = createListener(...args);
  if (!listener) {
    throw new Error("expected a listener in a DOM environment");
  }
  return listener;
}

describe("Creates Listener", () => {
  const listener = createListenerOrThrow();

  test("Listener has subscribe method", () => {
    expect(listener.subscribe).toBeDefined();
  });

  test("Listener has setMonitor method", () => {
    expect(listener.setMonitor).toBeDefined();
  });

  test("Subscribe returns subscription object with unsubscribe method", () => {
    const subscription = listener.subscribe("Space", () => {});
    expect(subscription).toBeDefined();
    expect(subscription.unsubscribe).toBeDefined();
  });

  test("Subscriptions are fired and receive KeyboardEvent object", () => {
    const mockCallback = vi.fn();
    listener.subscribe("Space", mockCallback);
    fireEvent.keyDown(document, { code: "Space" });

    expect(mockCallback).toHaveBeenCalled();
    // First argument [0] of first function call [0]
    expect(mockCallback.mock.calls[0]?.[0] instanceof KeyboardEvent).toBe(true);
  });

  test("Unsubscribe works", () => {
    const mockCallback = vi.fn();
    const subscription = listener.subscribe("KeyA", mockCallback);
    subscription.unsubscribe();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("Propagation works", () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn();
    listener.subscribe("KeyA", mockCallback1);
    listener.subscribe("KeyA", mockCallback2);
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback2).toHaveBeenCalled();
    expect(mockCallback1).toHaveBeenCalled();
  });

  test("Stop propagation works", () => {
    const mockCallback1 = vi.fn();
    const mockCallback2 = vi.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback1);
    listener.subscribe("KeyA", mockCallback2);
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback2).toHaveBeenCalled();
    expect(mockCallback1).not.toHaveBeenCalled();
  });

  test("Stop the global listener", () => {
    const listener = createListenerOrThrow();
    const mockCallback = vi.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback);
    listener.stopListening();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).not.toHaveBeenCalled();
  });

  test("Restart the global listener", () => {
    const listener = createListenerOrThrow();
    const mockCallback = vi.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback);
    listener.stopListening();
    listener.startListening();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).toHaveBeenCalled();
  });
});
