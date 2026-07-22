const EDITABLE_TAG_NAMES = ["INPUT", "TEXTAREA", "SELECT"];

/**
 * True when keystrokes on this target are text entry (form fields and
 * contenteditable regions) and shortcuts should stay out of the way.
 *
 * Unlike keyboardist 2.x, buttons are not treated as editable: they don't
 * accept text, and shortcuts should keep working while one is focused.
 */
const isEditableTarget = (target: unknown): boolean => {
  if (typeof HTMLElement === "undefined" || !(target instanceof HTMLElement)) {
    return false;
  }

  return (
    EDITABLE_TAG_NAMES.includes(target.tagName) || target.isContentEditable
  );
};

export default isEditableTarget;
