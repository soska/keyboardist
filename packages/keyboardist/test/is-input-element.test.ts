import { describe, expect, test } from "vitest";
import isInputElement from "../src/is-input-element";

describe("identifies input elements", () => {
  test("Correctly identifies input element", () => {
    const element = {
      tagName: "INPUT",
    };
    expect(isInputElement(element)).toBe(true);
  });

  test("Correctly identifies non input elements", () => {
    const element = {
      tagName: "P",
    };
    expect(isInputElement(element)).toBe(false);
  });
});
