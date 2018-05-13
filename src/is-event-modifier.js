const isEventModifier = event => {
  return (
    event.which === 16 ||
    event.which === 17 ||
    event.which === 18 ||
    event.which === 91
  );
};

export default isEventModifier;