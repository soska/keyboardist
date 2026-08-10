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

describe("layer basics", () => {
  test("a layer's bindings are inactive until pushed", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const layer = kb.layer("inactive-layer", { KeyQ: callback });

    expect(layer.isActive()).toBe(false);
    fireEvent.keyDown(document, { code: "KeyQ" });
    expect(callback).not.toHaveBeenCalled();
  });

  test("push activates, the returned handle pops", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const layer = kb.layer("pushable", { KeyW: callback });

    const pop = layer.push();
    expect(layer.isActive()).toBe(true);
    fireEvent.keyDown(document, { code: "KeyW" });
    expect(callback).toHaveBeenCalledTimes(1);

    pop();
    expect(layer.isActive()).toBe(false);
    fireEvent.keyDown(document, { code: "KeyW" });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("duplicate layer names throw", () => {
    const kb = createListenerOrThrow();
    kb.layer("dupe");
    expect(() => kb.layer("dupe")).toThrow();
  });

  test("the base layer name is reserved", () => {
    const kb = createListenerOrThrow();
    expect(() => kb.layer("base")).toThrow();
  });

  test("re-pushing an active layer moves it to the top", () => {
    const kb = createListenerOrThrow();
    const aCallback = vi.fn();
    const bCallback = vi.fn();
    const a = kb.layer("repush-a", { KeyE: aCallback });
    const b = kb.layer("repush-b", { KeyE: bCallback });

    a.push();
    b.push();
    a.push();

    fireEvent.keyDown(document, { code: "KeyE" });
    expect(aCallback).toHaveBeenCalled();
    expect(bCallback).not.toHaveBeenCalled();
  });

  test("dispose pops and removes the layer definition", () => {
    const kb = createListenerOrThrow();
    const layer = kb.layer("disposable", { KeyR: vi.fn(() => {}) });
    layer.push();
    layer.dispose();
    expect(layer.isActive()).toBe(false);
    expect(kb.layer("disposable")).toBeDefined(); // name is free again
  });
});

describe("dispatch rules", () => {
  test("a higher layer shadows lower layers for the same key", () => {
    const kb = createListenerOrThrow();
    const baseCallback = vi.fn();
    const layerCallback = vi.fn();
    kb.subscribe("KeyT", baseCallback);
    const modal = kb.layer("shadowing-modal", { KeyT: layerCallback });

    modal.push();
    fireEvent.keyDown(document, { code: "KeyT" });
    expect(layerCallback).toHaveBeenCalledTimes(1);
    expect(baseCallback).not.toHaveBeenCalled();

    modal.pop();
    fireEvent.keyDown(document, { code: "KeyT" });
    expect(baseCallback).toHaveBeenCalledTimes(1);
    expect(layerCallback).toHaveBeenCalledTimes(1);
  });

  test("unmatched keys fall through to lower layers by default", () => {
    const kb = createListenerOrThrow();
    const baseCallback = vi.fn();
    kb.subscribe("KeyY", baseCallback);
    kb.layer("fallthrough-modal", { escape: vi.fn(() => {}) }).push();

    fireEvent.keyDown(document, { code: "KeyY" });
    expect(baseCallback).toHaveBeenCalled();
  });

  test("an exclusive layer swallows unmatched keys", () => {
    const kb = createListenerOrThrow();
    const baseCallback = vi.fn();
    const modalCallback = vi.fn();
    kb.subscribe("KeyU", baseCallback);
    const modal = kb.layer(
      "exclusive-modal",
      { KeyI: modalCallback },
      { exclusive: true },
    );

    modal.push();
    fireEvent.keyDown(document, { code: "KeyU" });
    expect(baseCallback).not.toHaveBeenCalled();
    fireEvent.keyDown(document, { code: "KeyI" });
    expect(modalCallback).toHaveBeenCalled();

    modal.pop();
    fireEvent.keyDown(document, { code: "KeyU" });
    expect(baseCallback).toHaveBeenCalled();
  });

  test("an exclusive layer swallowing a key does not preventDefault", () => {
    const kb = createListenerOrThrow();
    const modal = kb.layer("inert-modal", {}, { exclusive: true });
    modal.push();

    // fireEvent returns false when preventDefault was called
    expect(fireEvent.keyDown(document, { code: "KeyO" })).toBe(true);
    modal.pop();
  });

  test("matching a key calls preventDefault", () => {
    const kb = createListenerOrThrow();
    kb.subscribe("KeyP", vi.fn());
    expect(fireEvent.keyDown(document, { code: "KeyP" })).toBe(false);
  });

  test("within a layer callbacks run LIFO and false stops propagation", () => {
    const kb = createListenerOrThrow();
    const first = vi.fn();
    const second = vi.fn().mockReturnValue(false);
    const layer = kb.layer("lifo-layer");
    layer.subscribe("KeyG", first);
    layer.subscribe("KeyG", second);
    layer.push();

    fireEvent.keyDown(document, { code: "KeyG" });
    expect(second).toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
  });

  test("popping a lower layer leaves layers above it intact", () => {
    // the overlapping-modals bug from the work KeyboardService, as a regression test
    const kb = createListenerOrThrow();
    const playerCallback = vi.fn();
    const modalCallback = vi.fn();
    const player = kb.layer("stacked-player", { KeyX: playerCallback });
    const modal = kb.layer("stacked-modal", { KeyX: modalCallback });

    player.push();
    modal.push();
    player.pop(); // popping the non-top layer

    fireEvent.keyDown(document, { code: "KeyX" });
    expect(modalCallback).toHaveBeenCalled();
    expect(playerCallback).not.toHaveBeenCalled();
  });

  test("friendly and raw key spellings match the same binding", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const layer = kb.layer("naming-layer", { "shift+up": callback });
    layer.push();

    fireEvent.keyDown(document, { code: "ArrowUp", shiftKey: true });
    expect(callback).toHaveBeenCalled();
  });
});

describe("map registration", () => {
  test("comma-separated keys bind one handler to several keys", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const layer = kb.layer("alias-layer", { "KeyJ,KeyK": callback });
    layer.push();

    fireEvent.keyDown(document, { code: "KeyJ" });
    fireEvent.keyDown(document, { code: "KeyK" });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("subscribe with comma aliases returns one subscription covering all keys", () => {
    const kb = createListenerOrThrow();
    const callback = vi.fn();
    const subscription = kb.subscribe("KeyN,KeyM", callback);

    fireEvent.keyDown(document, { code: "KeyN" });
    fireEvent.keyDown(document, { code: "KeyM" });
    expect(callback).toHaveBeenCalledTimes(2);

    subscription.unsubscribe();
    fireEvent.keyDown(document, { code: "KeyN" });
    fireEvent.keyDown(document, { code: "KeyM" });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  test("bind adds a map later and returns one subscription for the whole map", () => {
    const kb = createListenerOrThrow();
    const one = vi.fn();
    const two = vi.fn();
    const layer = kb.layer("bind-layer");
    layer.push();

    const subscription = layer.bind({ KeyC: one, KeyV: two });
    fireEvent.keyDown(document, { code: "KeyC" });
    fireEvent.keyDown(document, { code: "KeyV" });
    expect(one).toHaveBeenCalledTimes(1);
    expect(two).toHaveBeenCalledTimes(1);

    subscription.unsubscribe();
    fireEvent.keyDown(document, { code: "KeyC" });
    fireEvent.keyDown(document, { code: "KeyV" });
    expect(one).toHaveBeenCalledTimes(1);
    expect(two).toHaveBeenCalledTimes(1);
  });
});

describe("layer priority", () => {
  test("a higher-priority layer stays above a later plain push", () => {
    const kb = createListenerOrThrow();
    const modalCallback = vi.fn();
    const layoutCallback = vi.fn();
    const modal = kb.layer(
      "prio-modal",
      { Digit1: modalCallback },
      { priority: 3 },
    );
    const layout = kb.layer(
      "prio-layout",
      { Digit1: layoutCallback },
      { priority: 1 },
    );

    // pushed in "wrong" (React child-first) order: modal first, layout last
    modal.push();
    layout.push();

    fireEvent.keyDown(document, { code: "Digit1" });
    expect(modalCallback).toHaveBeenCalledTimes(1);
    expect(layoutCallback).not.toHaveBeenCalled();
  });

  test("equal priority keeps LIFO: later push wins", () => {
    const kb = createListenerOrThrow();
    const first = vi.fn();
    const second = vi.fn();
    kb.layer("prio-eq-a", { Digit2: first }, { priority: 2 }).push();
    kb.layer("prio-eq-b", { Digit2: second }, { priority: 2 }).push();

    fireEvent.keyDown(document, { code: "Digit2" });
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });

  test("three layers pushed in reverse priority order sort correctly", () => {
    const kb = createListenerOrThrow();
    const kb3 = vi.fn();
    const kb2 = vi.fn();
    const kb1 = vi.fn();
    kb.layer("prio-r3", { Digit3: kb3 }, { priority: 3 }).push();
    kb.layer("prio-r2", { Digit3: kb2 }, { priority: 2 }).push();
    kb.layer("prio-r1", { Digit3: kb1 }, { priority: 1 }).push();

    expect(kb.activeLayers()).toEqual([
      "prio-r3",
      "prio-r2",
      "prio-r1",
      "base",
    ]);
    fireEvent.keyDown(document, { code: "Digit3" });
    expect(kb3).toHaveBeenCalledTimes(1);
    expect(kb2).not.toHaveBeenCalled();
    expect(kb1).not.toHaveBeenCalled();
  });

  test("re-push moves to the top of its own priority band only", () => {
    const kb = createListenerOrThrow();
    const low = kb.layer("prio-band-low", {}, { priority: 1 });
    const lowLater = kb.layer("prio-band-low2", {}, { priority: 1 });
    const high = kb.layer("prio-band-high", {}, { priority: 5 });

    low.push();
    lowLater.push();
    high.push();
    low.push(); // re-push: tops its band, stays below high

    expect(kb.activeLayers()).toEqual([
      "prio-band-high",
      "prio-band-low",
      "prio-band-low2",
      "base",
    ]);
  });

  test("base layer stays at the bottom below priority-0 layers", () => {
    const kb = createListenerOrThrow();
    const baseCallback = vi.fn();
    const layerCallback = vi.fn();
    kb.subscribe("Digit4", baseCallback);
    kb.layer("prio-zero", { Digit4: layerCallback }).push();

    fireEvent.keyDown(document, { code: "Digit4" });
    expect(layerCallback).toHaveBeenCalledTimes(1);
    expect(baseCallback).not.toHaveBeenCalled();
    expect(kb.activeLayers()).toEqual(["prio-zero", "base"]);
  });

  test("a high-priority exclusive layer swallows keys below regardless of push order", () => {
    const kb = createListenerOrThrow();
    const layoutCallback = vi.fn();
    const modal = kb.layer(
      "prio-excl-modal",
      {},
      { priority: 9, exclusive: true },
    );
    const layout = kb.layer(
      "prio-excl-layout",
      { Digit5: layoutCallback },
      { priority: 1 },
    );

    modal.push();
    layout.push(); // pushed after, but lower priority: stays below the exclusive modal

    fireEvent.keyDown(document, { code: "Digit5" });
    expect(layoutCallback).not.toHaveBeenCalled();
  });

  test("getBindings reports priority", () => {
    const kb = createListenerOrThrow();
    kb.layer("prio-bindings", { Digit6: vi.fn(() => {}) }, { priority: 7 });

    expect(kb.getBindings()).toContainEqual({
      layer: "prio-bindings",
      key: "6",
      active: false,
      priority: 7,
    });
  });
});
