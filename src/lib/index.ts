import isInputElement from "./is-input-element";
import isInputEvent from "./is-input-event";
import isEventModifier from "./is-event-modifier";
import getKeyEventName from "./get-key-event-name";
import { getBus, MinibusCallback } from "@jiveworld/minibus";

const defaultMonitor = (eventName: string) => {
  console.log(":keyboard event:", eventName);
};

type KeyboardEvent = "keydown" | "keyup";

function createListener(
  listenForEvent: KeyboardEvent = "keydown",
  element: Document | Element | null = null
) {
  const bus = getBus("@minibus/" + listenForEvent);

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

  function normalize(eventName: string) {
    return eventName
      .toLowerCase() // Subscripton names are lowercased so both 'Shift+Space' and 'shift+space' works.
      .replace(/\s/, ""); // remove spaces so both 'Shift + Space' and 'shift+space' works.
  }

  // listens to the event and fires the appropiate event subscription
  function handleKeyEvent(event: any) {
    if (isEventModifier(event)) {
      return;
    }

    if (ignoreInputEvents && isInputEvent(event)) {
      return;
    }

    const eventName = normalize(getKeyEventName(event));

    const noEvents = bus.isChannelEmpty(eventName);

    bus.emit("monitor", eventName, !noEvents, event);
    bus.emit(eventName, event);
  }

  // creates a subscription and returns the unsubscribe function;
  function subscribe(name: string, callback: () => void) {
    const subscription = bus.subscribe(normalize(name), (event) => {
      event.preventDefault();
      callback();
    });
    return subscription;
  }

  // alows to set a monitor function that will run on every event
  function setMonitor(monitor: MinibusCallback | Boolean = false) {
    if (monitor === true) {
      bus.subscribe("monitor", defaultMonitor);
    } else if (typeof monitor === "function") {
      bus.subscribe("monitor", monitor);
    }
  }

  // adds the event listener to the element
  function startListening() {
    if (element) {
      element.addEventListener(listenForEvent, handleKeyEvent);
    }
  }

  // removes the event listener from the element
  function stopListening() {
    if (element) {
      element.removeEventListener(listenForEvent, handleKeyEvent);
    }
  }

  startListening();

  return { subscribe, setMonitor, startListening, stopListening };
}

export default createListener;
