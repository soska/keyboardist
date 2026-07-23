import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useKeyBindings } from "../src/use-key-bindings";

describe("useKeyBindings", () => {
  test("bindings fire on keydown", () => {
    const callback = vi.fn();
    renderHook(() => useKeyBindings({ KeyA: callback }));

    fireEvent.keyDown(document, { code: "KeyA" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("unmount unsubscribes", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyBindings({ KeyB: callback }));

    unmount();
    fireEvent.keyDown(document, { code: "KeyB" });
    expect(callback).not.toHaveBeenCalled();
  });

  test("inline objects: rerender with a new object neither drops nor duplicates", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      // a fresh object every render, like inline JSX props
      ({ cb }) => useKeyBindings({ KeyC: cb }),
      { initialProps: { cb: callback } },
    );

    rerender({ cb: callback });
    rerender({ cb: callback });

    fireEvent.keyDown(document, { code: "KeyC" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("the latest callback is used after rerender", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(({ cb }) => useKeyBindings({ KeyD: cb }), {
      initialProps: { cb: first },
    });

    rerender({ cb: second });
    fireEvent.keyDown(document, { code: "KeyD" });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  test("changing the key set rebinds", () => {
    const callback = vi.fn();
    const { rerender } = renderHook(({ keys }) => useKeyBindings(keys), {
      initialProps: { keys: { KeyE: callback } as Record<string, () => void> },
    });

    rerender({ keys: { KeyF: callback } });

    fireEvent.keyDown(document, { code: "KeyE" });
    expect(callback).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { code: "KeyF" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("comma aliases bind several keys", () => {
    const callback = vi.fn();
    renderHook(() => useKeyBindings({ "KeyG,KeyH": callback }));

    fireEvent.keyDown(document, { code: "KeyG" });
    fireEvent.keyDown(document, { code: "KeyH" });
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
