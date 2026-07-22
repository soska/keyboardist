import { describe, expect, test } from "vitest";
import isInputEvent from "../src/is-input-event";

describe("identifies input events", () => {
  test("Correctly identifies input event", () => {
    const event = {
      target: {
        tagName: "INPUT",
      },
    };
    expect(isInputEvent(event)).toBe(true);
  });

  test("Correctly identifies non input event", () => {
    const event = {
      target: {
        tagName: "P",
      },
    };
    expect(isInputEvent(event)).toBe(false);
  });
});
