import isInputElement from "./is-input-element";
import isInputEvent from "./is-input-event";
import isEventModifier from "./is-event-modifier";
import getKeyEventName from "./get-key-event-name";
import { getBus } from "@jiveworld/minibus";

const defaultMonitor = (eventName) => {
  console.log(":keyboard event:", eventName);
};

function createListener(listenForEvent = "keydown", element = null) {
  const bus = getBus("@minibus/" + listenForEvent);
  window.bus = bus;

  if (typeof window === "undefined") {
    // not a browser environment?
    return false;
  }

  let __monitor = null;

  // default element is the window document
  if (element === null) {
    element = window.document;
  }

  // ignore input events, except when the element is an input.
  const ignoreInputEvents = !isInputElement(element);

  function normalize(eventName) {
    return eventName
      .toLowerCase() // Subscripton names are lowercased so both 'Shift+Space' and 'shift+space' works.
      .replace(/\s/, ""); // remove spaces so both 'Shift + Space' and 'shift+space' works.
  }

  // listens to the event and fires the appropiate event subscription
  function handleKeyEvent(event) {
    console.log(event);
    if (isEventModifier(event)) {
      return;
    }

    if (ignoreInputEvents && isInputEvent(event)) {
      return;
    }

    const eventName = normalize(getKeyEventName(event));
    bus.emit(eventName, event);
  }

  // creates a subscription and returns the unsubscribe function;
  function subscribe(name, callback) {
    const subscription = bus.subscribe(normalize(name), (event) => {
      event.preventDefault();
      callback();
    });
    return subscription;
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
