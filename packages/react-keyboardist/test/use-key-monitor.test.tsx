import { fireEvent } from "@testing-library/dom";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useKeyMonitor } from "../src/use-key-monitor";

describe("useKeyMonitor", () => {
  test("receives structured monitor info", () => {
    const monitor = vi.fn();
    const { unmount } = renderHook(() => useKeyMonitor(monitor));

    fireEvent.keyDown(document, { code: "KeyU", shiftKey: true });

    expect(monitor).toHaveBeenCalledTimes(1);
    expect(monitor.mock.calls[0]?.[0]).toMatchObject({
      keyName: "shift+u",
      matched: expect.any(Boolean),
    });
    unmount();
  });

  test("cleans up on unmount", () => {
    const monitor = vi.fn();
    const { unmount } = renderHook(() => useKeyMonitor(monitor));

    unmount();
    fireEvent.keyDown(document, { code: "KeyV" });
    expect(monitor).not.toHaveBeenCalled();
  });

  test("the latest monitor function is used after rerender", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender, unmount } = renderHook(({ fn }) => useKeyMonitor(fn), {
      initialProps: { fn: first },
    });

    rerender({ fn: second });
    fireEvent.keyDown(document, { code: "KeyW" });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    unmount();
  });
});
