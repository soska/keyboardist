import { expandKeyAliases } from "./normalize-key-name";

// biome-ignore lint/suspicious/noConfusingVoidType: callbacks may return nothing; `undefined` would reject void-returning functions
export type SubscriptionCallback = (event: KeyboardEvent) => boolean | void;

export type BindingMap = Record<string, SubscriptionCallback>;

export interface Subscription {
  unsubscribe: () => void;
  [Symbol.dispose]: () => void;
}

export interface LayerOptions {
  /**
   * When active, an exclusive layer stops unmatched keys from falling
   * through to the layers below it — they simply go inert.
   */
  exclusive?: boolean;
}

export interface PopHandle {
  (): void;
  [Symbol.dispose]: () => void;
}

export interface Layer {
  readonly name: string;
  readonly exclusive: boolean;
  subscribe: (name: string, callback: SubscriptionCallback) => Subscription;
  bind: (bindings: BindingMap) => Subscription;
  push: () => PopHandle;
  pop: () => void;
  isActive: () => boolean;
  dispose: () => void;
}

export interface BindingInfo {
  layer: string;
  key: string;
  active: boolean;
}

export type MatchResult =
  | { type: "match"; layerName: string; listeners: SubscriptionCallback[] }
  | { type: "swallowed" }
  | { type: "miss" };

interface LayerState {
  name: string;
  exclusive: boolean;
  subscriptions: Map<string, SubscriptionCallback[]>;
}

export const BASE_LAYER_NAME = "base";

function makeSubscription(unsubscribe: () => void): Subscription {
  return { unsubscribe, [Symbol.dispose]: unsubscribe };
}

/**
 * Owns the layer definitions and the active stack. The base layer sits
 * permanently at the bottom of the stack; other layers are pushed on top,
 * top-most wins. Popping is order-independent: removing a lower layer
 * leaves the layers above it untouched.
 */
export class LayerStack {
  private states = new Map<string, LayerState>();
  private stack: LayerState[] = [];
  readonly base: Layer;

  constructor() {
    this.base = this.define(BASE_LAYER_NAME);
    const baseState = this.states.get(BASE_LAYER_NAME) as LayerState;
    this.stack.push(baseState);
  }

  define(name: string, bindings?: BindingMap, options?: LayerOptions): Layer {
    if (this.states.has(name)) {
      throw new Error(`keyboardist: a layer named "${name}" already exists`);
    }

    const state: LayerState = {
      name,
      exclusive: options?.exclusive ?? false,
      subscriptions: new Map(),
    };
    this.states.set(name, state);

    const subscribe = (
      keyName: string,
      callback: SubscriptionCallback,
    ): Subscription => {
      const keys = expandKeyAliases(keyName);
      for (const key of keys) {
        const listeners = state.subscriptions.get(key) ?? [];
        listeners.push(callback);
        state.subscriptions.set(key, listeners);
      }
      return makeSubscription(() => {
        for (const key of keys) {
          const listeners = state.subscriptions.get(key);
          if (!listeners) {
            continue;
          }
          const index = listeners.indexOf(callback);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        }
      });
    };

    const bind = (map: BindingMap): Subscription => {
      const subscriptions = Object.entries(map).map(([key, callback]) =>
        subscribe(key, callback),
      );
      return makeSubscription(() => {
        for (const subscription of subscriptions) {
          subscription.unsubscribe();
        }
      });
    };

    const pop = () => {
      const index = this.stack.indexOf(state);
      if (index > 0) {
        // index 0 is the base layer, which cannot be popped
        this.stack.splice(index, 1);
      }
    };

    const push = (): PopHandle => {
      pop(); // re-pushing an active layer moves it to the top
      this.stack.push(state);
      const handle = (() => {
        pop();
      }) as PopHandle;
      handle[Symbol.dispose] = handle;
      return handle;
    };

    const isActive = () => this.stack.includes(state);

    const layer: Layer = {
      name,
      exclusive: state.exclusive,
      subscribe,
      bind,
      push,
      pop,
      isActive,
      dispose: () => {
        pop();
        this.states.delete(name);
      },
    };

    if (bindings) {
      bind(bindings);
    }

    return layer;
  }

  /**
   * Walks the stack top → bottom. The first layer with a binding for the
   * key wins and shadows everything below; an exclusive layer with no
   * binding swallows the key instead of letting it fall through.
   */
  match(keyName: string): MatchResult {
    for (let i = this.stack.length - 1; i >= 0; i--) {
      const layer = this.stack[i] as LayerState;
      const listeners = layer.subscriptions.get(keyName);
      if (listeners && listeners.length > 0) {
        return {
          type: "match",
          layerName: layer.name,
          listeners: [...listeners],
        };
      }
      if (layer.exclusive) {
        return { type: "swallowed" };
      }
    }
    return { type: "miss" };
  }

  activeLayers(): string[] {
    return [...this.stack].reverse().map((state) => state.name);
  }

  getBindings(): BindingInfo[] {
    const bindings: BindingInfo[] = [];
    for (const state of this.states.values()) {
      const active = this.stack.includes(state);
      for (const [key, listeners] of state.subscriptions) {
        if (listeners.length > 0) {
          bindings.push({ layer: state.name, key, active });
        }
      }
    }
    return bindings;
  }
}
