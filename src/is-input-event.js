const isInputEvent = event => {
  var tag = (event.target || event.nativeEvent.target).tagName;
  return (
    tag === 'BUTTON' ||
    tag === 'INPUT' ||
    tag === 'SELECT' ||
    tag === 'TEXTAREA'
  );
};

export default isInputEvent;