'use strict';

var isInputElement = function isInputElement(element) {
  if (!element || !element.tagName) {
    return false;
  }

  return element.tagName === 'BUTTON' || element.tagName === 'INPUT' || element.tagName === 'SELECT' || element.tagName === 'TEXTAREA';
};

var isInputEvent = function isInputEvent(event) {
  return isInputElement(event.target || event.nativeEvent.target);
};

var modifiers = {
  ShiftLeft: 'shift',
  ShiftRight: 'shift',
  AltLeft: 'alt',
  AltRight: 'alt',
  MetaLeft: 'meta',
  MetaRight: 'meta',
  ControlLeft: 'control',
  ControlRight: 'control'
};

var isEventModifier = function isEventModifier(event) {
  // new browsers
  if ('code' in event) {
    return !!modifiers[event.code];
  }

  // old browsers
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
  27: 'escape',
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
  222: "'",

  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right'
};

var getKeyEventName = function getKeyEventName(event) {
  var keyName = '';
  var keys = [];

  if ('code' in event) {
    keyName = map[event.code] ? map[event.code] : event.code;
  } else {
    var keyCode = event.which;
    keyName = String.fromCharCode(keyCode).toLowerCase();
    if (map[keyCode]) {
      keyName = map[keyCode];
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

var defaultMonitor = function defaultMonitor(eventName) {
  console.log(':keyboard event:', eventName);
};

function createListener() {
  var listenForEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'keydown';
  var element = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (typeof window === 'undefined') {
    // not a browser environment?
    return false;
  }

  var __subscriptions = {};
  var __monitor = null;

  // default element is the window document
  if (element === null) {
    element = window.document;
  }

  // ignore input events, except when the element is an input.
  var ignoreInputEvents = !isInputElement(element);

  // listens to the event and fires the appropiate event subscription
  function handleKeyEvent(event) {
    if (isEventModifier(event)) {
      return;
    }

    if (ignoreInputEvents && isInputEvent(event)) {
      return;
    }

    var eventName = getKeyEventName(event);
    var listeners = __subscriptions[eventName.toLowerCase()] || [];

    if (typeof __monitor === 'function') {
      var matched = listeners.length > 0;
      __monitor(eventName, matched, event);
    }

    if (listeners.length) {
      event.preventDefault();
    }

    // flag to tell if execution should continue;
    var propagate = true;
    //
    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i]) {
        propagate = listeners[i](event);
      }
      if (propagate === false) {
        break;
      }
    }
    // listeners.map(listener => listener());
  }

  // creates a subscription and returns the unsubscribe function;
  function subscribe(name, callback) {
    // Subscripton names are lowercased so both 'Shift+Space' and 'shift+space' works.
    name = name.toLowerCase();
    // remove spaces so both 'Shift + Space' and 'shift+space' works.
    name.replace(/\s/, '');

    if (typeof __subscriptions[name] === 'undefined') {
      __subscriptions[name] = [];
    }
    __subscriptions[name].push(callback);
    return {
      unsubscribe: function unsubscribe() {
        var index = __subscriptions[name].indexOf(callback);
        __subscriptions[name].splice(index, 1);
      }
    };
  }

  // alows to set a monitor function that will run on every event
  function setMonitor() {
    var monitor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (monitor === true) {
      __monitor = defaultMonitor;
    } else {
      __monitor = monitor;
    }
  }

  // adds the event listener to the element
  function startListening() {
    element.addEventListener(listenForEvent, handleKeyEvent);
  }

  // removes the event listener from the element
  function stopListening() {
    element.removeEventListener(listenForEvent, handleKeyEvent);
  }

  startListening();

  return { subscribe: subscribe, setMonitor: setMonitor, startListening: startListening, stopListening: stopListening };
}

module.exports = createListener;
