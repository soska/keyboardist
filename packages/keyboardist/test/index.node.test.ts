// @vitest-environment node
import { describe, expect, test } from "vitest";
import { createListener } from "../src/index";

describe("Creates listener outside browser environment", () => {
  test("Listener returned is false", () => {
    expect(createListener()).toBe(false);
  });
});
