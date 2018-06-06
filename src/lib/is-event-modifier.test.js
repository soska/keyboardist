import isEventModifier from './is-event-modifier';

describe('Is event modifier', () => {
  test('Correctly detects shift', () => {
    expect(
      isEventModifier({
        code: 'ShiftLeft',
      })
    ).toBe(true);
  });
  test('Correctly detects alt', () => {
    expect(
      isEventModifier({
        code: 'AltLeft',
      })
    ).toBe(true);
  });
  test('Correctly detects meta', () => {
    expect(
      isEventModifier({
        code: 'MetaRight',
      })
    ).toBe(true);
  });
  test('Correctly detects non-modifier key', () => {
    expect(
      isEventModifier({
        code: 'ArrowUp',
      })
    ).toBe(false);
  });

  test('Works with which', () => {
    expect(
      isEventModifier({
        which: 16,
      })
    ).toBe(true);
  });
});
