const modifiers = {
  ShiftLeft: "shift",
  ShiftRight: "shift",
  AltLeft: "alt",
  AltRight: "alt",
  MetaLeft: "meta",
  MetaRight: "meta",
  ControlLeft: "control",
  ControlRight: "control",
};

const isEventModifier = (event: KeyboardEvent): boolean => {
  // modern browsers
  if ("code" in event) {
    return Object.hasOwn(modifiers, event.code);
  }

  // old browsers
  const { which } = event as KeyboardEvent;
  return which === 16 || which === 17 || which === 18 || which === 91;
};

export default isEventModifier;
