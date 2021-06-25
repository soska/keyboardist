/**
 * @jest-environment node
 */
import createListener from "./index";

describe('Creates listener outside browser environment', () => {
  const listener = createListener();

  test('Listener returned is false', () => {
    expect(listener).toBe(false);
  });
});
