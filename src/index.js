import isInputEvent from './is-input-event';
import isEventModifier from './is-event-modifier';
import getKeyEventName from './get-key-event-name';

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
        listeners.splice(index, 1);
      },
    };
  }

  document.addEventListener(listenForEvent, handleKeyEvent);

  return { subscribe };
}

export default createListener;
