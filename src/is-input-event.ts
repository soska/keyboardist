import isInputElement from "./is-input-element";

const isInputEvent = (event: any) => {
  return isInputElement(event.target || event.nativeEvent.target);
};

export default isInputEvent;
