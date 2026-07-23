import type { BindingMap, KeyboardEventName, Layer } from "keyboardist";
import { useContext, useEffect, useId, useMemo, useRef } from "react";
import { KeyboardDepthContext } from "./depth-context";
import { getSharedListener } from "./shared-listener";
import { keySignatureOf } from "./use-key-bindings";
import { useLatest } from "./use-latest";

export interface UseKeyboardLayerOptions {
  /** Layer name; auto-generated (collision-free) when omitted */
  name?: string;
  /** Unmatched keys go inert instead of falling through */
  exclusive?: boolean;
  /** Whether the layer is on the stack; defaults to true */
  active?: boolean;
  /**
   * Stack priority. Defaults to the component's depth in the tree (via
   * <KeyboardLayer>/<KeyboardScope> nesting), so inner layers win
   * overlapping keys regardless of React's child-first effect order.
   * Set explicitly to override the derived depth.
   */
  priority?: number;
  event?: KeyboardEventName;
}

export interface KeyboardLayerHandle {
  isActive: () => boolean;
  push: () => void;
  pop: () => void;
}

/**
 * Creates a keyboardist layer for the lifetime of the component, pushes it
 * while `active` (default true), and disposes it on unmount.
 */
export function useKeyboardLayer(
  bindings: BindingMap,
  options: UseKeyboardLayerOptions = {},
): KeyboardLayerHandle {
  const { name, exclusive = false, active = true, event = "keydown" } = options;
  const autoId = useId();
  const layerName = name ?? `react:${autoId}`;
  const depth = useContext(KeyboardDepthContext);
  const priority = options.priority ?? depth + 1;

  const bindingsRef = useLatest(bindings);
  const keySignature = keySignatureOf(bindings);
  const layerRef = useRef<Layer | null>(null);

  // create the layer for this component's lifetime
  useEffect(() => {
    const listener = getSharedListener(event);
    if (!listener) {
      return;
    }
    const layer = listener.layer(layerName, undefined, { exclusive, priority });
    layerRef.current = layer;
    return () => {
      layer.dispose();
      layerRef.current = null;
    };
  }, [event, layerName, exclusive, priority]);

  // keep the layer's bindings in sync with the current key set
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs after the layer is recreated (event/layerName/exclusive) or when the key set changes (keySignature); callbacks are read through bindingsRef
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) {
      return;
    }
    const subscriptions = Object.keys(bindingsRef.current).map((key) =>
      layer.subscribe(key, (keyboardEvent) =>
        bindingsRef.current[key]?.(keyboardEvent),
      ),
    );
    return () => {
      for (const subscription of subscriptions) {
        subscription.unsubscribe();
      }
    };
  }, [event, layerName, exclusive, priority, keySignature, bindingsRef]);

  // push/pop driven by `active`
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-pushes after the layer is recreated by the effect above
  useEffect(() => {
    const layer = layerRef.current;
    if (!layer || !active) {
      return;
    }
    layer.push();
    return () => {
      layer.pop();
    };
  }, [event, layerName, exclusive, priority, active]);

  return useMemo(
    () => ({
      isActive: () => layerRef.current?.isActive() ?? false,
      push: () => {
        layerRef.current?.push();
      },
      pop: () => {
        layerRef.current?.pop();
      },
    }),
    [],
  );
}
