import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · Keyboardist` : "Keyboardist";
    return () => {
      document.title = "Keyboardist";
    };
  }, [title]);
}
