import { fireEvent } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { createPortal } from "react-dom";
import { describe, expect, test, vi } from "vitest";
import { KeyboardLayer, KeyboardScope } from "../../src/react/components";
import { useKeyboardLayer } from "../../src/react/use-keyboard-layer";

describe("nesting = priority", () => {
  test("the headline regression: nested layers mounted in one commit — innermost wins", () => {
    // <DashboardLayout><Posts><EditPostModal/></Posts></DashboardLayout>
    // React runs effects child-first, so the modal PUSHES FIRST and the
    // layout last — without depth-derived priority the layout would win.
    const layoutEscape = vi.fn();
    const postsEscape = vi.fn();
    const modalEscape = vi.fn();

    const { unmount } = render(
      <KeyboardLayer name="dashboard" bindings={{ escape: layoutEscape }}>
        <KeyboardLayer name="posts" bindings={{ escape: postsEscape }}>
          <KeyboardLayer name="edit-modal" bindings={{ escape: modalEscape }} />
        </KeyboardLayer>
      </KeyboardLayer>,
    );

    fireEvent.keyDown(document, { code: "Escape" });
    expect(modalEscape).toHaveBeenCalledTimes(1);
    expect(postsEscape).not.toHaveBeenCalled();
    expect(layoutEscape).not.toHaveBeenCalled();
    unmount();
  });

  test("outer layer wins again after the inner one unmounts", () => {
    const outerCallback = vi.fn();
    const innerCallback = vi.fn();

    function Tree({ showInner }: { showInner: boolean }) {
      return (
        <KeyboardLayer name="nest-outer" bindings={{ KeyZ: outerCallback }}>
          {showInner && (
            <KeyboardLayer
              name="nest-inner"
              bindings={{ KeyZ: innerCallback }}
            />
          )}
        </KeyboardLayer>
      );
    }

    const { rerender, unmount } = render(<Tree showInner={true} />);
    fireEvent.keyDown(document, { code: "KeyZ" });
    expect(innerCallback).toHaveBeenCalledTimes(1);
    expect(outerCallback).not.toHaveBeenCalled();

    rerender(<Tree showInner={false} />);
    fireEvent.keyDown(document, { code: "KeyZ" });
    expect(outerCallback).toHaveBeenCalledTimes(1);
    expect(innerCallback).toHaveBeenCalledTimes(1);
    unmount();
  });

  test("siblings at the same depth: later mount wins", () => {
    const first = vi.fn();
    const second = vi.fn();

    const { unmount: unmountFirst } = render(
      <KeyboardLayer name="sib-a" bindings={{ Digit0: first }} />,
    );
    const { unmount: unmountSecond } = render(
      <KeyboardLayer name="sib-b" bindings={{ Digit0: second }} />,
    );

    fireEvent.keyDown(document, { code: "Digit0" });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
    unmountSecond();
    unmountFirst();
  });

  test("explicit priority prop overrides derived depth", () => {
    const outerCallback = vi.fn();
    const innerCallback = vi.fn();

    const { unmount } = render(
      <KeyboardLayer
        name="override-outer"
        bindings={{ KeyX: outerCallback }}
        priority={50}
      >
        <KeyboardLayer
          name="override-inner"
          bindings={{ KeyX: innerCallback }}
        />
      </KeyboardLayer>,
    );

    fireEvent.keyDown(document, { code: "KeyX" });
    expect(outerCallback).toHaveBeenCalledTimes(1);
    expect(innerCallback).not.toHaveBeenCalled();
    unmount();
  });

  test("KeyboardScope increments depth for hook-only users", () => {
    const shallowCallback = vi.fn();
    const deepCallback = vi.fn();

    function ShallowLayer() {
      useKeyboardLayer({ KeyV: shallowCallback }, { name: "scope-shallow" });
      return null;
    }
    function DeepLayer() {
      useKeyboardLayer({ KeyV: deepCallback }, { name: "scope-deep" });
      return null;
    }

    // Deep layer mounts FIRST in effect order (deeper in tree), shallow
    // second — depth from KeyboardScope must still make the deep one win.
    const { unmount } = render(
      <>
        <KeyboardScope>
          <KeyboardScope>
            <DeepLayer />
          </KeyboardScope>
        </KeyboardScope>
        <ShallowLayer />
      </>,
    );

    fireEvent.keyDown(document, { code: "KeyV" });
    expect(deepCallback).toHaveBeenCalledTimes(1);
    expect(shallowCallback).not.toHaveBeenCalled();
    unmount();
  });

  test("portal-rendered modals keep their logical nesting priority", () => {
    const layoutCallback = vi.fn();
    const modalCallback = vi.fn();

    function PortaledModal() {
      return createPortal(
        <KeyboardLayer name="portal-modal" bindings={{ KeyB: modalCallback }}>
          <div>portal modal</div>
        </KeyboardLayer>,
        document.body,
      );
    }

    const { unmount } = render(
      <KeyboardLayer name="portal-layout" bindings={{ KeyB: layoutCallback }}>
        <PortaledModal />
      </KeyboardLayer>,
    );

    fireEvent.keyDown(document, { code: "KeyB" });
    expect(modalCallback).toHaveBeenCalledTimes(1);
    expect(layoutCallback).not.toHaveBeenCalled();
    unmount();
  });
});
