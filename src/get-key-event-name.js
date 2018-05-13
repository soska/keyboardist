import keyMap from './key-map';

const getKeyEventName = event => {
  const keyCode = event.which;
  const keys = [];

  let keyName = String.fromCharCode(keyCode).toLowerCase();

  if (keyMap[keyCode]) {
    keyName = keyMap[keyCode];
  }

  if (event.altKey) {
    keys.push('alt');
  }

  if (event.shiftKey) {
    keys.push('shift');
  }

  if (event.ctrlKey) {
    keys.push('ctrl');
  }

  keys.push(keyName);

  return keys.join('+');
};

export default getKeyEventName;