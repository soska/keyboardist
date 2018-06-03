import createListener from './index';

describe('Creates Listener', () => {
  const listener = createListener();
  test('Listener has subscribe method', () => {
    expect(listener.subscribe).toBeDefined();
  });

  test('Listener has setMonitor method', () => {
    expect(listener.setMonitor).toBeDefined();
  });

  test('Subscribe returns subscription object with unsubscribe method', () => {
    const subscription = listener.subscribe('Space', () => {});
    expect(subscription).toBeDefined();
    expect(subscription.unsubscribe).toBeDefined();
  });
});
