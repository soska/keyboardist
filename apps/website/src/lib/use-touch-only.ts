import { useEffect, useState } from "react";

const QUERY = "(hover: none) and (pointer: coarse)";

/**
 * True on devices that look keyboardless — touch-primary, no hover. Every
 * demo on this site drives off real keydown/keyup events, so these devices
 * can't really run them; used to surface a heads-up.
 */
export function useTouchOnly() {
  const [touchOnly, setTouchOnly] = useState(
    () => window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const update = () => setTouchOnly(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return touchOnly;
}
