import type { KeyboardEventName, MonitorCallback } from "keyboardist";
import { useEffect } from "react";
import { getSharedListener } from "./shared-listener";
import { useLatest } from "./use-latest";

const monitorOwners = new WeakMap<object, symbol>();

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
    const owner = Symbol("monitor-owner");
    monitorOwners.set(listener, owner);
    listener.setMonitor((info) => monitorRef.current?.(info));
    return () => {
      if (monitorOwners.get(listener) !== owner) {
        return;
      }
      monitorOwners.delete(listener);
      listener.setMonitor(false);
    };
  }, [event, hasMonitor, monitorRef]);
}
