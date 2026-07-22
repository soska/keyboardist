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
    const layer = kb.layer("disposable", { KeyR: vi.fn() });
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
    kb.layer("fallthrough-modal", { escape: vi.fn() }).push();

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
