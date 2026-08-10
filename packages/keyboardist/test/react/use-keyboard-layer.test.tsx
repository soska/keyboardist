import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useKeyBindings } from "../../src/react/use-key-bindings";
import { useKeyboardLayer } from "../../src/react/use-keyboard-layer";

describe("useKeyboardLayer", () => {
  test("layer bindings fire while mounted and active", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyboardLayer({ KeyI: callback }));

    fireEvent.keyDown(document, { code: "KeyI" });
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.keyDown(document, { code: "KeyI" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("active: false keeps the layer off the stack", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ active }) => useKeyboardLayer({ KeyJ: callback }, { active }),
      { initialProps: { active: false } },
    );

    fireEvent.keyDown(document, { code: "KeyJ" });
    expect(callback).not.toHaveBeenCalled();

    rerender({ active: true });
    fireEvent.keyDown(document, { code: "KeyJ" });
    expect(callback).toHaveBeenCalledTimes(1);

    rerender({ active: false });
    fireEvent.keyDown(document, { code: "KeyJ" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("exclusive layer swallows keys bound below it", () => {
    const baseCallback = vi.fn();
    const { unmount: unmountBase } = renderHook(() =>
      useKeyBindings({ KeyK: baseCallback }),
    );
    const { unmount: unmountLayer } = renderHook(() =>
      useKeyboardLayer({ KeyL: vi.fn(() => {}) }, { exclusive: true }),
    );

    fireEvent.keyDown(document, { code: "KeyK" });
    expect(baseCallback).not.toHaveBeenCalled();

    unmountLayer();
    fireEvent.keyDown(document, { code: "KeyK" });
    expect(baseCallback).toHaveBeenCalledTimes(1);
    unmountBase();
  });

  test("two instances with auto names don't collide", () => {
    const one = vi.fn();
    const two = vi.fn();
    renderHook(() => useKeyboardLayer({ KeyO: one }));
    renderHook(() => useKeyboardLayer({ KeyP: two }));

    fireEvent.keyDown(document, { code: "KeyO" });
    fireEvent.keyDown(document, { code: "KeyP" });
    expect(one).toHaveBeenCalledTimes(1);
    expect(two).toHaveBeenCalledTimes(1);
  });

  test("returns a working handle", () => {
    const callback = vi.fn();
    const { result } = renderHook(() =>
      useKeyboardLayer({ KeyQ: callback }, { active: false }),
    );

    expect(result.current.isActive()).toBe(false);
    result.current.push();
    expect(result.current.isActive()).toBe(true);
    fireEvent.keyDown(document, { code: "KeyQ" });
    expect(callback).toHaveBeenCalledTimes(1);
    result.current.pop();
    expect(result.current.isActive()).toBe(false);
  });
});
