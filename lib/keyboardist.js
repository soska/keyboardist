'use strict';

var isInputEvent = function isInputEvent(event) {
  var tag = (event.target || event.nativeEvent.target).tagName;
  return tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
};

var isEventModifier = function isEventModifier(event) {
  return event.which === 16 || event.which === 17 || event.which === 18 || event.which === 91;
};

var map = {
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

var getKeyEventName = function getKeyEventName(event) {
  var keyCode = event.which;
  var keys = [];

  var keyName = String.fromCharCode(keyCode).toLowerCase();

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

function createListener() {
  var listenForEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'keydown';

  var allListeners = {};

  function handleKeyEvent(event) {
    if (isEventModifier(event)) {
      return;
    }

    if (isInputEvent(event)) {
      return;
    }

    var eventName = getKeyEventName(event);
    var listeners = allListeners[eventName] || [];

    if (listeners.length) {
      event.preventDefault();
    }

    listeners.map(function (listener) {
      return listener();
    });
  }

  function subscribe(eventName, callback) {
    if (typeof allListeners[eventName] === 'undefined') {
      allListeners[eventName] = [];
    }
    allListeners[eventName].push(callback);
    return {
      unsubscribe: function unsubscribe() {
        var index = allListeners[eventName].indexOf(callback);
        allListeners[eventName].splice(index, 1);
      }
    };
  }

  document.addEventListener(listenForEvent, handleKeyEvent);

  return { subscribe: subscribe };
}

module.exports = createListener;
