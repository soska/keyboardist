import createListener from "./index";
import { fireEvent } from "dom-testing-library";

describe("Creates Listener", () => {
  const listener = createListener();
  test("Listener has subscribe method", () => {
    expect(listener.subscribe).toBeDefined();
  });

  test("Listener has setMonitor method", () => {
    expect(listener.setMonitor).toBeDefined();
  });

  test("Subscribe returns subscription object with unsubscribe method", () => {
    const subscription = listener.subscribe("Space", () => {});
    expect(subscription).toBeDefined();
    expect(subscription.unsubscribe).toBeDefined();
  });

  test("Subscriptions are fired", () => {
    const mockCallback = jest.fn();
    listener.subscribe("Space", mockCallback);
    fireEvent.keyDown(document, { code: "Space" });
    expect(mockCallback).toBeCalled();
  });

  test("Unsubscribe works", () => {
    const mockCallback = jest.fn();
    const subscription = listener.subscribe("KeyA", mockCallback);
    subscription.unsubscribe();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).not.toBeCalled();
  });

  test("Propagation works", () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();
    listener.subscribe("KeyA", mockCallback1);
    listener.subscribe("KeyA", mockCallback2);
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback2).toBeCalled();
    expect(mockCallback1).toBeCalled();
  });

  test("Stop propagation works", () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback1);
    listener.subscribe("KeyA", mockCallback2);
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback2).toBeCalled();
    expect(mockCallback1).not.toBeCalled();
  });

  test("Stop the global listener", () => {
    const listener = createListener();
    const mockCallback = jest.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback);
    listener.stopListening();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).not.toBeCalled();
  });

  test("Restart the global listener", () => {
    const listener = createListener();
    const mockCallback = jest.fn().mockReturnValue(false);
    listener.subscribe("KeyA", mockCallback);
    listener.stopListening();
    listener.startListening();
    fireEvent.keyDown(document, { code: "KeyA" });
    expect(mockCallback).toBeCalled();
  });
});
