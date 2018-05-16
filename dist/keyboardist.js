(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Keyboardist = factory());
}(this, (function () { 'use strict';

const isInputEvent = event => {
  var tag = (event.target || event.nativeEvent.target).tagName;
  return tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
};

const isEventModifier = event => {
  return event.which === 16 || event.which === 17 || event.which === 18 || event.which === 91;
};

const map = {
  8: 'backspace',
  9: 'tab',
  13: 'enter',
  16: 'shift',
  17: 'ctrl',
  18: 'alt',
  20: 'capslock',
  27: 'esc',
  32: 'space',
  33: 'pageup',
  34: 'pagedown',
  35: 'end',
  36: 'home',
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
  45: 'ins',
  46: 'del',
  91: 'meta',
  93: 'meta',
  224: 'meta',

  106: '*',
  107: '+',
  109: '-',
  110: '.',
  111: '/',
  186: ';',
  187: '=',
  188: ',',
  189: '-',
  190: '.',
  191: '/',
  192: '`',
  219: '[',
  220: '\\',
  221: ']',
  222: "'"
};

const getKeyEventName = event => {
  const keyCode = event.which;
  const keys = [];

  let keyName = String.fromCharCode(keyCode).toLowerCase();

  if (map[keyCode]) {
    keyName = map[keyCode];
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

function createListener(listenForEvent = 'keydown') {
  let allListeners = {};

  function handleKeyEvent(event) {
    if (isEventModifier(event)) {
      return;
    }

    if (isInputEvent(event)) {
      return;
    }

    const eventName = getKeyEventName(event);
    const listeners = allListeners[eventName] || [];

    if (listeners.length) {
      event.preventDefault();
    }

    listeners.map(listener => listener());
  }

  function subscribe(eventName, callback) {
    if (typeof allListeners[eventName] === 'undefined') {
      allListeners[eventName] = [];
    }
    allListeners[eventName].push(callback);
    return {
      unsubscribe: () => {
        const index = allListeners[eventName].indexOf(callback);
        allListeners[eventName].splice(index, 1);
      }
    };
  }

  document.addEventListener(listenForEvent, handleKeyEvent);

  return { subscribe };
}

return createListener;

})));
