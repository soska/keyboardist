import isInputElement from './is-input-element';

const isInputEvent = event => {
  return isInputElement(event.target || event.nativeEvent.target);
};

export default isInputEvent;
