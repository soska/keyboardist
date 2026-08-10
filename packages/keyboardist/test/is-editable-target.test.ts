import { describe, expect, test } from "vitest";
import isEditableTarget from "../src/is-editable-target";

describe("isEditableTarget", () => {
  test("text-entry elements are editable", () => {
    expect(isEditableTarget(document.createElement("input"))).toBe(true);
    expect(isEditableTarget(document.createElement("textarea"))).toBe(true);
    expect(isEditableTarget(document.createElement("select"))).toBe(true);
  });

  test("contenteditable elements are editable", () => {
    const div = document.createElement("div");
    div.contentEditable = "true";
    expect(isEditableTarget(div)).toBe(true);
  });

  test("buttons are NOT editable (unlike keyboardist 2.x)", () => {
    expect(isEditableTarget(document.createElement("button"))).toBe(false);
  });

  test("plain elements are not editable", () => {
    expect(isEditableTarget(document.createElement("div"))).toBe(false);
    expect(isEditableTarget(document.createElement("p"))).toBe(false);
  });

  test("non-elements are not editable", () => {
    expect(isEditableTarget(null)).toBe(false);
    expect(isEditableTarget(undefined)).toBe(false);
    expect(isEditableTarget(document)).toBe(false);
    expect(isEditableTarget({ tagName: "INPUT" })).toBe(false);
  });
});
