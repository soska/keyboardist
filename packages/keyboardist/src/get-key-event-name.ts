import keyMap from "./key-map";

type KeyMapKey = keyof typeof keyMap;

const getKeyEventName = (event: KeyboardEvent): string => {
  let keyName = "";
  const keys: string[] = [];

  if ("code" in event) {
    // modern browsers
    if (!event.code) {
      return "unknown";
    }
    keyName = Object.hasOwn(keyMap, event.code)
      ? keyMap[event.code as KeyMapKey]
      : event.code;
  } else {
    // old browsers
    const keyCode = (event as KeyboardEvent).which;
    keyName = String.fromCharCode(keyCode).toLowerCase();
    const mapped = keyMap[keyCode as KeyMapKey];
    if (mapped) {
      keyName = mapped;
    }
  }

  if (event.altKey) {
    keys.push("Alt");
  }

  if (event.shiftKey) {
    keys.push("Shift");
  }

  if (event.ctrlKey) {
    keys.push("Ctrl");
  }

  if (event.metaKey) {
    keys.push("Meta");
  }

  keys.push(keyName);

  return keys.join("+");
};

export default getKeyEventName;
