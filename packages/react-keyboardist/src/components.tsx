import type {
  BindingMap,
  KeyboardEventName,
  MonitorCallback,
} from "keyboardist";
import {
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ReactNode,
  useRef,
} from "react";
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
  event?: KeyboardEventName;
  children?: ReactNode;
}

/**
 * Scopes the keyboard to its bindings while mounted (and `active`). Wrap a
 * modal in an exclusive layer and it owns the keyboard until it unmounts.
 */
export function KeyboardLayer({
  bindings,
  name,
  exclusive,
  active,
  event,
  children,
}: KeyboardLayerProps) {
  useKeyboardLayer(bindings, { name, exclusive, active, event });
  return <>{children}</>;
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
