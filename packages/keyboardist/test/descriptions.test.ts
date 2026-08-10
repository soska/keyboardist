import { fireEvent } from "@testing-library/dom";
import { describe, expect, test, vi } from "vitest";
import { createListener, type KeyboardistListener } from "../src/index";

function createListenerOrThrow(): KeyboardistListener {
  const listener = createListener();
  if (!listener) {
    throw new Error("expected a listener in a DOM environment");
  }
  return listener;
}

function bindingFor(kb: KeyboardistListener, key: string) {
  return kb.getBindings().find((binding) => binding.key === key);
}

describe("describing a subscription", () => {
  test("an options object attaches a description", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("Down", () => {}, { description: "Moves down" });

    expect(bindingFor(kb, "down")).toMatchObject({
      layer: "base",
      key: "down",
      active: true,
      description: "Moves down",
    });
  });

  test("a bare string is shorthand for a description", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("Up", () => {}, "Moves up");

    expect(bindingFor(kb, "up")?.description).toBe("Moves up");
  });

  test("an undescribed binding has no description key at all", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("KeyQ", () => {});

    const binding = bindingFor(kb, "q");
    expect(binding).toBeDefined();
    expect(binding).not.toHaveProperty("description");
  });

  test("describing a binding does not disturb what it does", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    kb.subscribe("KeyE", callback, "Does a thing");

    fireEvent.keyDown(document, { code: "KeyE" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("a description reaches every key of an alias list", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("j,k", () => {}, "Moves through the list");

    expect(bindingFor(kb, "j")?.description).toBe("Moves through the list");
    expect(bindingFor(kb, "k")?.description).toBe("Moves through the list");
  });

  test("unsubscribing takes the description with it", () => {
    const kb = createListenerOrThrow();
    const subscription = kb.subscribe("KeyT", () => {}, "Temporary");

    expect(bindingFor(kb, "t")?.description).toBe("Temporary");
    subscription.unsubscribe();
    expect(bindingFor(kb, "t")).toBeUndefined();
  });
});

describe("descriptions in a bindings map", () => {
  test("the object form carries a description", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    kb.layer("editor", {
      KeyS: { handler: callback, description: "Saves the document" },
    }).push();

    expect(bindingFor(kb, "s")).toMatchObject({
      layer: "editor",
      description: "Saves the document",
    });

    fireEvent.keyDown(document, { code: "KeyS" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("bare callbacks and described bindings mix in one map", () => {
    const kb = createListenerOrThrow();
    kb.layer("mixed", {
      KeyA: () => {},
      KeyB: { handler: () => {}, description: "Bee" },
    }).push();

    expect(bindingFor(kb, "a")).not.toHaveProperty("description");
    expect(bindingFor(kb, "b")?.description).toBe("Bee");
  });
});

describe("hidden bindings", () => {
  test("a hidden binding stays out of getBindings", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    kb.subscribe("shift+slash", callback, { hidden: true });

    expect(bindingFor(kb, "shift+slash")).toBeUndefined();
  });

  test("a hidden binding still fires", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    kb.subscribe("KeyH", callback, { hidden: true });

    fireEvent.keyDown(document, { code: "KeyH" });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("several subscriptions on one key", () => {
  test("the last description subscribed wins", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("KeyM", () => {}, "First");
    kb.subscribe("KeyM", () => {}, "Second");

    expect(bindingFor(kb, "m")?.description).toBe("Second");
  });

  test("an undescribed later subscription keeps the earlier description", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("KeyN", () => {}, "Documented");
    kb.subscribe("KeyN", () => {});

    expect(bindingFor(kb, "n")?.description).toBe("Documented");
  });

  test("unsubscribing the winner falls back to the earlier description", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("KeyO", () => {}, "Original");
    const second = kb.subscribe("KeyO", () => {}, "Override");

    expect(bindingFor(kb, "o")?.description).toBe("Override");
    second.unsubscribe();
    expect(bindingFor(kb, "o")?.description).toBe("Original");
  });

  test("unsubscribing one of two identical callbacks leaves the other", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const first = kb.subscribe("KeyP", callback);
    kb.subscribe("KeyP", callback);

    first.unsubscribe();
    fireEvent.keyDown(document, { code: "KeyP" });
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("descriptions across layers", () => {
  test("the same key keeps a separate description per layer", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("Escape", () => {}, "Clears the search");
    const modal = kb.layer("modal", {
      Escape: { handler: () => {}, description: "Closes the modal" },
    });
    modal.push();

    const escapes = kb
      .getBindings()
      .filter((binding) => binding.key === "escape");

    expect(escapes).toHaveLength(2);
    expect(
      escapes.find((binding) => binding.layer === "base")?.description,
    ).toBe("Clears the search");
    expect(
      escapes.find((binding) => binding.layer === "modal")?.description,
    ).toBe("Closes the modal");
  });

  test("active tells a help sheet which description is live", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("Escape", () => {}, "Clears the search");
    const modal = kb.layer("modal", {
      Escape: { handler: () => {}, description: "Closes the modal" },
    });

    const liveBefore = kb
      .getBindings()
      .filter((binding) => binding.key === "escape" && binding.active);
    expect(liveBefore.map((binding) => binding.layer)).toEqual(["base"]);

    modal.push();
    const liveAfter = kb
      .getBindings()
      .filter((binding) => binding.key === "escape" && binding.active);
    expect(liveAfter.map((binding) => binding.layer).sort()).toEqual([
      "base",
      "modal",
    ]);
  });
});
