import isInputElement from "./is-input-element";

describe("identifies input elements", () => {
  test("Correctly identifies input event", () => {
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
