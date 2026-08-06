import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import type { BindingInfo } from "../../src/index";
import { getSharedListener } from "../../src/react/shared-listener";
import { useKeyBindings } from "../../src/react/use-key-bindings";
import { useKeyboardLayer } from "../../src/react/use-keyboard-layer";

function bindingFor(key: string): BindingInfo | undefined {
  const listener = getSharedListener();
  if (!listener) {
    throw new Error("expected a shared listener in a DOM environment");
  }
  return listener.getBindings().find((binding) => binding.key === key);
}

describe("useKeyBindings descriptions", () => {
  test("the object form documents a binding", () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyBindings({
        KeyA: { handler: callback, description: "Selects all" },
      }),
    );

    expect(bindingFor("a")?.description).toBe("Selects all");
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("editing a description updates it without changing the key set", () => {
    // Regression guard: descriptions are captured at subscribe time, so the
    // dependency signature has to notice them changing on their own.
    const { rerender } = renderHook(
      ({ description }) =>
        useKeyBindings({ KeyB: { handler: () => {}, description } }),
      { initialProps: { description: "Before" } },
    );

    expect(bindingFor("b")?.description).toBe("Before");

    rerender({ description: "After" });
    expect(bindingFor("b")?.description).toBe("After");
  });

  test("a rerender with an unchanged description does not duplicate", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ cb }) =>
        useKeyBindings({ KeyC: { handler: cb, description: "Same" } }),
      { initialProps: { cb: callback } },
    );

    rerender({ cb: callback });
    rerender({ cb: callback });

    fireEvent.keyDown(document, { code: "KeyC" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("unmount removes the documented binding", () => {
    const { unmount } = renderHook(() =>
      useKeyBindings({ KeyD: { handler: () => {}, description: "Gone soon" } }),
    );

    expect(bindingFor("d")?.description).toBe("Gone soon");
    unmount();
    expect(bindingFor("d")).toBeUndefined();
  });

  test("a bare callback still works alongside documented ones", () => {
    const bare = vi.fn();
    renderHook(() =>
      useKeyBindings({
        KeyE: bare,
        KeyF: { handler: () => {}, description: "Documented" },
      }),
    );

    fireEvent.keyDown(document, { code: "KeyE" });
    expect(bare).toHaveBeenCalledTimes(1);
    expect(bindingFor("e")).not.toHaveProperty("description");
    expect(bindingFor("f")?.description).toBe("Documented");
  });

  test("the latest handler runs even when only the description changed", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ cb, description }) =>
        useKeyBindings({ KeyG: { handler: cb, description } }),
      { initialProps: { cb: first, description: "One" } },
    );

    rerender({ cb: second, description: "Two" });
    fireEvent.keyDown(document, { code: "KeyG" });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });
});

describe("useKeyboardLayer descriptions", () => {
  test("a layer's bindings carry their descriptions", () => {
    renderHook(() =>
      useKeyboardLayer(
        { KeyH: { handler: () => {}, description: "Shows help" } },
        { name: "help-layer" },
      ),
    );

    expect(bindingFor("h")).toMatchObject({
      layer: "help-layer",
      description: "Shows help",
      active: true,
    });
  });

  test("hidden bindings stay out of a layer's listing but still fire", () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyboardLayer(
        { KeyI: { handler: callback, hidden: true } },
        { name: "hidden-layer" },
      ),
    );

    expect(bindingFor("i")).toBeUndefined();
    fireEvent.keyDown(document, { code: "KeyI" });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
