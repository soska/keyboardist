const inputTagNames = ["BUTTON", "INPUT", "SELECT", "TEXTAREA"];

const isInputElement = (element: unknown): boolean => {
  if (!element || typeof element !== "object" || !("tagName" in element)) {
    return false;
  }

  const { tagName } = element as { tagName: unknown };
  return typeof tagName === "string" && inputTagNames.includes(tagName);
};

export default isInputElement;
