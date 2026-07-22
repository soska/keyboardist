import { describe, expect, test } from "vitest";
import { expandKeyAliases, normalizeKeyName } from "../src/normalize-key-name";

describe("normalizeKeyName", () => {
  test("lowercases plain keys", () => {
    expect(normalizeKeyName("Escape")).toBe("escape");
    expect(normalizeKeyName("Space")).toBe("space");
  });

  test("strips the Key prefix from raw codes", () => {
    expect(normalizeKeyName("KeyA")).toBe("a");
    expect(normalizeKeyName("keya")).toBe("a");
  });

  test("strips the Arrow prefix from raw codes", () => {
    expect(normalizeKeyName("ArrowUp")).toBe("up");
    expect(normalizeKeyName("ArrowLeft")).toBe("left");
  });

  test("digits: Digit1 and 1 are the same key, numpad stays distinct", () => {
    expect(normalizeKeyName("Digit1")).toBe("1");
    expect(normalizeKeyName("1")).toBe("1");
    expect(normalizeKeyName("Numpad1")).toBe("numpad1");
  });

  test("raw and friendly spellings normalize to the same name", () => {
    expect(normalizeKeyName("Shift+ArrowUp")).toBe(
      normalizeKeyName("shift+up"),
    );
    expect(normalizeKeyName("KeyA")).toBe(normalizeKeyName("a"));
  });

  test("ignores whitespace", () => {
    expect(normalizeKeyName("Shift + Space")).toBe("shift+space");
    expect(normalizeKeyName(" shift+space ")).toBe("shift+space");
  });

  test("orders modifiers canonically: alt, shift, ctrl, meta", () => {
    expect(normalizeKeyName("ctrl+shift+p")).toBe("shift+ctrl+p");
    expect(normalizeKeyName("meta+alt+k")).toBe("alt+meta+k");
    expect(normalizeKeyName("Meta+Ctrl+Shift+Alt+X")).toBe(
      "alt+shift+ctrl+meta+x",
    );
  });

  test("accepts modifier aliases", () => {
    expect(normalizeKeyName("cmd+k")).toBe("meta+k");
    expect(normalizeKeyName("command+k")).toBe("meta+k");
    expect(normalizeKeyName("control+c")).toBe("ctrl+c");
    expect(normalizeKeyName("option+f")).toBe("alt+f");
  });

  test("dedupes repeated modifiers", () => {
    expect(normalizeKeyName("shift+shift+a")).toBe("shift+a");
  });

  test("empty input normalizes to unknown", () => {
    expect(normalizeKeyName("")).toBe("unknown");
    expect(normalizeKeyName("  ")).toBe("unknown");
  });
});

describe("expandKeyAliases", () => {
  test("splits comma-separated keys and normalizes each", () => {
    expect(expandKeyAliases("j,k")).toEqual(["j", "k"]);
    expect(expandKeyAliases("KeyJ, KeyK")).toEqual(["j", "k"]);
  });

  test("single key yields a single entry", () => {
    expect(expandKeyAliases("shift+up")).toEqual(["shift+up"]);
  });

  test("drops empty segments", () => {
    expect(expandKeyAliases("a,,b,")).toEqual(["a", "b"]);
  });
});
