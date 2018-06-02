const modifiers = {
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'meta',
  MetaRight: 'meta',
  ControlLeft: 'control',
  ControlRight: 'control',
};

const isEventModifier = event => {
  // new browsers
  if ('code' in event) {
    return !!modifiers[event.code];
  }

  // old browsers
  return (
    event.which === 16 ||
    event.which === 17 ||
    event.which === 18 ||
    event.which === 91
  );
};

export default isEventModifier;
