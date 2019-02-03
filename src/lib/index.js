import isInputElement from './is-input-element';
import isInputEvent from './is-input-event';
import isEventModifier from './is-event-modifier';
import getKeyEventName from './get-key-event-name';

const defaultMonitor = eventName => {
  console.log(':keyboard event:', eventName);
};

function createListener(listenForEvent = 'keydown', element = null) {
  if (typeof window === undefined) {
    // not a browser environment?
    return false;
  }

  let __subscriptions = {};
  let __monitor = null;

  // default element is the window document
  if (element === null) {
    element = window.document;
  }

  // ignore input events, except when the element is an input.
  const ignoreInputEvents = !isInputElement(element);

  // listens to the event and fires the appropiate event subscription
  function handleKeyEvent(event) {
    if (isEventModifier(event)) {
      return;
    }

    if (ignoreInputEvents && isInputEvent(event)) {
      return;
    }

    const eventName = getKeyEventName(event);
    const listeners = __subscriptions[eventName.toLowerCase()] || [];

    if (typeof __monitor === 'function') {
      const matched = listeners.length > 0;
      __monitor(eventName, matched, event);
    }

    if (listeners.length) {
      event.preventDefault();
    }

    // flag to tell if execution should continue;
    let propagate = true;
    //
    for (let i = listeners.length - 1; i >= 0; i--) {
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
      unsubscribe: () => {
        const index = __subscriptions[name].indexOf(callback);
        __subscriptions[name].splice(index, 1);
      },
    };
  }

  // alows to set a monitor function that will run on every event
  function setMonitor(monitor = null) {
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

  return { subscribe, setMonitor, startListening, stopListening };
}

export default createListener;
