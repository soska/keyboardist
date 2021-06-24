import keyMap from "./key-map";
type keyMapKey = keyof typeof keyMap;

const getKeyEventName = (event: KeyboardEvent) => {
  let keyName = "";
  const keys = [];

  if ("code" in event) {
    const code = event.code as keyMapKey;
    keyName = keyMap.hasOwnProperty(event.code) ? keyMap[code] : `${code}`;
  } else {
    const keyCode = event.which;
    keyName = String.fromCharCode(keyCode).toLowerCase();
    if (keyMap[keyCode as keyMapKey]) {
      keyName = keyMap[keyCode as keyMapKey];
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
