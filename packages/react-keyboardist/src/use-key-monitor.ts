import type { KeyboardEventName, MonitorCallback } from "keyboardist";
import { useEffect } from "react";
import { getSharedListener } from "./shared-listener";
import { useLatest } from "./use-latest";

export interface UseKeyMonitorOptions {
  event?: KeyboardEventName;
}

/**
 * Sets the shared listener's monitor while mounted. Note: a listener has a
 * single monitor slot, so the most recently mounted monitor wins.
 */
export function useKeyMonitor(
  monitor: MonitorCallback | undefined,
  options: UseKeyMonitorOptions = {},
): void {
  const { event = "keydown" } = options;
  const monitorRef = useLatest(monitor);
  const hasMonitor = typeof monitor === "function";

  useEffect(() => {
    if (!hasMonitor) {
      return;
    }
    const listener = getSharedListener(event);
    if (!listener) {
      return;
    }
    listener.setMonitor((info) => monitorRef.current?.(info));
    return () => {
      listener.setMonitor(false);
    };
  }, [event, hasMonitor, monitorRef]);
}
