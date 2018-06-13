'use strict';

var isInputEvent = function isInputEvent(event) {
  var tag = (event.target || event.nativeEvent.target).tagName;
  return tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
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

  keys.push(keyName);

  return keys.join('+');
};

var defaultMonitor = function defaultMonitor(eventName) {
  console.log(":keyboard event:", eventName);
};

function createListener() {
  var listenForEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "keydown";

  var allListeners = {};

  var __monitor__ = null;

  // listens to the event and fires the appropiate event subscription
  function handleKeyEvent(event) {
    if (isEventModifier(event)) {
      return;
    }

    if (isInputEvent(event)) {
      return;
    }

    var eventName = getKeyEventName(event);

    var listeners = allListeners[eventName.toLowerCase()] || [];

    if (typeof __monitor__ === "function") {
      var matched = listeners.length > 0;
      __monitor__(eventName, matched, event);
    }

    if (listeners.length) {
      event.preventDefault();
    }

    // flag to tell if execution should continue;
    var propagate = true;
    //
    for (var i = listeners.length - 1; i >= 0; i--) {
      if (listeners[i]) {
        propagate = listeners[i]();
      }
      if (propagate === false) {
        break;
      }
    }
    // listeners.map(listener => listener());
  }

  // creates a subscription
  // returns the unsubscribe function;
  function subscribe(eventName, callback) {
    // the keys are lowercased so both 'Shift+Space' and 'shift+space' works.
    eventName = eventName.toLowerCase();
    // remove spaces so both 'Shift + Space' and 'shift+space' works.
    eventName.replace(/\s/, "");

    if (typeof allListeners[eventName] === "undefined") {
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

  // alows to set a monitor function that will run on every event
  function setMonitor() {
    var monitor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (monitor === true) {
      __monitor__ = defaultMonitor;
    } else {
      __monitor__ = monitor;
    }
  }

  // adds the event listener to the document
  function startListening() {
    document.addEventListener(listenForEvent, handleKeyEvent);
  }

  // removes the event listener from the document
  function stopListening() {
    document.removeEventListener(listenForEvent, handleKeyEvent);
  }

  startListening();

  return { subscribe: subscribe, setMonitor: setMonitor, startListening: startListening, stopListening: stopListening };
}

module.exports = createListener;
