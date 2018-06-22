const isInputElement = element => {
  if (!element || !element.tagName) {
    return false;
  }

  return (
    element.tagName === 'BUTTON' ||
    element.tagName === 'INPUT' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA'
  );
};

export default isInputElement;
