import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
  useContext,
  useRef,
} from "react";
import type { BindingMap, KeyboardEventName, MonitorCallback } from "../index";
import { KeyboardDepthContext } from "./depth-context";
import { useElementKeyBindings } from "./use-element-key-bindings";
import { useKeyBindings } from "./use-key-bindings";
import { useKeyMonitor } from "./use-key-monitor";
import { useKeyboardLayer } from "./use-keyboard-layer";

export interface KeyboardistProps {
  bindings: BindingMap;
  monitor?: MonitorCallback;
  event?: KeyboardEventName;
}

/**
 * Declarative global keyboard bindings. Renders nothing.
 */
export function Keyboardist({ bindings, monitor, event }: KeyboardistProps) {
  useKeyBindings(bindings, { event });
  useKeyMonitor(monitor, { event });
  return null;
}

export interface KeyboardLayerProps {
  bindings: BindingMap;
  name?: string;
  exclusive?: boolean;
  active?: boolean;
  /** Overrides the depth-derived stack priority */
  priority?: number;
  event?: KeyboardEventName;
  children?: ReactNode;
}

/**
 * Scopes the keyboard to its bindings while mounted (and `active`). Wrap a
 * modal in an exclusive layer and it owns the keyboard until it unmounts.
 *
 * Nested KeyboardLayers derive their stack priority from the JSX nesting:
 * inner layers win overlapping keys, even when the whole tree mounts in a
 * single commit (where React's child-first effect order would otherwise
 * put the outermost layer on top).
 */
export function KeyboardLayer({
  bindings,
  name,
  exclusive,
  active,
  priority,
  event,
  children,
}: KeyboardLayerProps) {
  const depth = useContext(KeyboardDepthContext);
  useKeyboardLayer(bindings, { name, exclusive, active, priority, event });
  return (
    <KeyboardDepthContext.Provider value={depth + 1}>
      {children}
    </KeyboardDepthContext.Provider>
  );
}

/**
 * Increments the keyboard nesting depth for its children without creating
 * a layer of its own — for hook-only users composing useKeyboardLayer
 * across components. <KeyboardLayer> provides this automatically.
 */
export function KeyboardScope({ children }: { children?: ReactNode }) {
  const depth = useContext(KeyboardDepthContext);
  return (
    <KeyboardDepthContext.Provider value={depth + 1}>
      {children}
    </KeyboardDepthContext.Provider>
  );
}

export type KeyboardInputProps = {
  bindings: BindingMap;
  event?: KeyboardEventName;
  component?: ElementType;
} & Omit<ComponentPropsWithoutRef<"input">, "component">;

/**
 * Renders an input (or any `component`) with a dedicated listener attached
 * to it — bindings keep firing while the user types in it.
 */
export const KeyboardInput = forwardRef<HTMLElement, KeyboardInputProps>(
  function KeyboardInput(
    { bindings, event, component: Component = "input", ...rest },
    forwardedRef,
  ) {
    const innerRef = useRef<Element | null>(null);
    useElementKeyBindings(innerRef, bindings, { event });

    const setRef = (node: HTMLElement | null) => {
      innerRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef) {
        forwardedRef.current = node;
      }
    };

    return <Component ref={setRef} {...rest} />;
  },
);
