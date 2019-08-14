import keyMap from './key-map';

const getKeyEventName = event => {
  let keyName = '';
  const keys = [];

  if ('code' in event) {
    keyName = keyMap[event.code] ? keyMap[event.code] : event.code;
  } else {
    const keyCode = event.which;
    keyName = String.fromCharCode(keyCode).toLowerCase();
    if (keyMap[keyCode]) {
      keyName = keyMap[keyCode];
    }
  }

  if (event.altKey) {
    keys.push('Alt');
  }

  if (event.shiftKey) {
    keys.push('Shift');
  }

  if (event.ctrlKey) {
    keys.push('Ctrl');
  }

  if (event.metaKey) {
    keys.push('Meta');
  }

  keys.push(keyName);

  return keys.join('+');
};

export default getKeyEventName;
