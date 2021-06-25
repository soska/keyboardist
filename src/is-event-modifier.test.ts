import isEventModifier from "./is-event-modifier";

describe("Is event modifier", () => {
  test("Correctly detects shift", () => {
    expect(
      isEventModifier({
        code: "ShiftLeft",
      } as KeyboardEvent)
    ).toBe(true);
  });
  test("Correctly detects alt", () => {
    expect(
      isEventModifier({
        code: "AltLeft",
      } as KeyboardEvent)
    ).toBe(true);
  });
  test("Correctly detects meta", () => {
    expect(
      isEventModifier({
        code: "MetaRight",
      } as KeyboardEvent)
    ).toBe(true);
  });
  test("Correctly detects non-modifier key", () => {
    expect(
      isEventModifier({
        code: "ArrowUp",
      } as KeyboardEvent)
    ).toBe(false);
  });

  test("Works with which", () => {
    expect(
      isEventModifier({
        which: 16,
      } as KeyboardEvent)
    ).toBe(true);
  });
});
