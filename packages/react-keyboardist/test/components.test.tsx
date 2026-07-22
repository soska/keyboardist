import { fireEvent } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, test, vi } from "vitest";
import { KeyboardInput, Keyboardist, KeyboardLayer } from "../src/components";

describe("<Keyboardist>", () => {
  test("renders nothing and binds keys", () => {
    const callback = vi.fn();
    const { container, unmount } = render(
      <Keyboardist bindings={{ KeyR: callback }} />,
    );

    expect(container.firstChild).toBe(null);
    fireEvent.keyDown(document, { code: "KeyR" });
    expect(callback).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.keyDown(document, { code: "KeyR" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("accepts a monitor", () => {
    const monitor = vi.fn();
    const { unmount } = render(<Keyboardist bindings={{}} monitor={monitor} />);

    fireEvent.keyDown(document, { code: "KeyS" });
    expect(monitor).toHaveBeenCalledTimes(1);
    expect(monitor.mock.calls[0]?.[0]).toMatchObject({ keyName: "s" });
    unmount();
  });
});

describe("<KeyboardLayer>", () => {
  test("renders children and scopes the keyboard while mounted", () => {
    const baseCallback = vi.fn();
    const escapeCallback = vi.fn();
    render(<Keyboardist bindings={{ KeyT: baseCallback }} />);

    const { getByText, unmount } = render(
      <KeyboardLayer bindings={{ escape: escapeCallback }} exclusive>
        <div>modal content</div>
      </KeyboardLayer>,
    );

    expect(getByText("modal content")).toBeDefined();

    fireEvent.keyDown(document, { code: "KeyT" });
    expect(baseCallback).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { code: "Escape" });
    expect(escapeCallback).toHaveBeenCalledTimes(1);

    unmount();
    fireEvent.keyDown(document, { code: "KeyT" });
    expect(baseCallback).toHaveBeenCalledTimes(1);
  });
});

describe("<KeyboardInput>", () => {
  test("renders an input whose bindings fire while it has focus", () => {
    const onDown = vi.fn();
    const { getByRole } = render(<KeyboardInput bindings={{ down: onDown }} />);

    const input = getByRole("textbox");
    fireEvent.keyDown(input, { code: "ArrowDown" });
    expect(onDown).toHaveBeenCalledTimes(1);
  });

  test("forwards its ref", () => {
    const ref = createRef<HTMLInputElement>();
    render(<KeyboardInput bindings={{}} ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  test("renders a custom component/tag", () => {
    const { container } = render(
      <KeyboardInput bindings={{}} component="textarea" />,
    );
    expect(container.querySelector("textarea")).not.toBe(null);
  });
});
