import { expandKeyAliases } from "./normalize-key-name";

// biome-ignore lint/suspicious/noConfusingVoidType: callbacks may return nothing; `undefined` would reject void-returning functions
export type SubscriptionCallback = (event: KeyboardEvent) => boolean | void;

export interface BindingOptions {
  /**
   * What the binding does, in words. Surfaced by `getBindings()`, so a UI
   * can generate its own shortcut sheet from the live bindings.
   */
  description?: string;
  /** Keeps the binding out of `getBindings()` — for internal plumbing */
  hidden?: boolean;
}

/** A bare string is shorthand for `{ description }`. */
export type BindingDescriptor = string | BindingOptions;

/** A binding written as an object, so it can carry a description. */
export interface BindingEntry extends BindingOptions {
  handler: SubscriptionCallback;
}

export type BindingMap = Record<string, SubscriptionCallback | BindingEntry>;

/** Normalizes the shorthand string form of a descriptor. */
export function toBindingOptions(
  descriptor?: BindingDescriptor,
): BindingOptions {
  if (typeof descriptor === "string") {
    return { description: descriptor };
  }
  return descriptor ?? {};
}

/** Normalizes the shorthand bare-callback form of a binding. */
export function resolveBinding(
  binding: SubscriptionCallback | BindingEntry,
): BindingEntry {
  return typeof binding === "function" ? { handler: binding } : binding;
}

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
  /**
   * Stack rank (default 0). Higher-priority layers always sit above
   * lower-priority ones regardless of push order; within the same
   * priority, the latest push is on top. Lets callers whose push order
   * doesn't match their logical nesting (e.g. React effects running
   * child-first) still get the stack they mean.
   */
  priority?: number;
}

export interface PopHandle {
  (): void;
  [Symbol.dispose]: () => void;
}

export interface Layer {
  readonly name: string;
  readonly exclusive: boolean;
  readonly priority: number;
  subscribe: (
    name: string,
    callback: SubscriptionCallback,
    descriptor?: BindingDescriptor,
  ) => Subscription;
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
  priority: number;
  /** Present when the binding was subscribed with a description */
  description?: string;
}

export type MatchResult =
  | { type: "match"; layerName: string; listeners: SubscriptionCallback[] }
  | { type: "swallowed" }
  | { type: "miss" };

/** One subscription: the callback plus whatever it was documented with. */
interface BindingRecord extends BindingOptions {
  callback: SubscriptionCallback;
}

interface LayerState {
  name: string;
  exclusive: boolean;
  priority: number;
  subscriptions: Map<string, BindingRecord[]>;
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
      priority: options?.priority ?? 0,
      subscriptions: new Map(),
    };
    this.states.set(name, state);

    const subscribe = (
      keyName: string,
      callback: SubscriptionCallback,
      descriptor?: BindingDescriptor,
    ): Subscription => {
      const keys = expandKeyAliases(keyName);
      const record: BindingRecord = {
        callback,
        ...toBindingOptions(descriptor),
      };
      for (const key of keys) {
        const records = state.subscriptions.get(key) ?? [];
        records.push(record);
        state.subscriptions.set(key, records);
      }
      // Removal is by record identity, so subscribing the same callback
      // twice and unsubscribing once drops only that subscription.
      return makeSubscription(() => {
        for (const key of keys) {
          const records = state.subscriptions.get(key);
          if (!records) {
            continue;
          }
          const index = records.indexOf(record);
          if (index !== -1) {
            records.splice(index, 1);
          }
        }
      });
    };

    const bind = (map: BindingMap): Subscription => {
      const subscriptions = Object.entries(map).map(([key, binding]) => {
        const { handler, ...options } = resolveBinding(binding);
        return subscribe(key, handler, options);
      });
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
      pop(); // re-pushing an active layer re-inserts it by the same rule
      // Insert below any higher-priority layers, on top of the layer's own
      // priority band (equal priority stays LIFO). Index 0 is the base
      // layer, which nothing may go below.
      let index = this.stack.length;
      while (
        index > 1 &&
        (this.stack[index - 1] as LayerState).priority > state.priority
      ) {
        index--;
      }
      this.stack.splice(index, 0, state);
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
      priority: state.priority,
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
      const records = layer.subscriptions.get(keyName);
      if (records && records.length > 0) {
        return {
          type: "match",
          layerName: layer.name,
          listeners: records.map((record) => record.callback),
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

  /**
   * Every live binding, with the description it was subscribed with — enough
   * to render a shortcut sheet. Where a key has several subscriptions in one
   * layer, the last one subscribed wins per field: it is also the first to
   * run, so it is the one the user actually gets.
   */
  getBindings(): BindingInfo[] {
    const bindings: BindingInfo[] = [];
    for (const state of this.states.values()) {
      const active = this.stack.includes(state);
      for (const [key, records] of state.subscriptions) {
        if (records.length === 0) {
          continue;
        }

        let description: string | undefined;
        let hidden = false;
        for (const record of records) {
          if (record.description !== undefined) {
            description = record.description;
          }
          if (record.hidden !== undefined) {
            hidden = record.hidden;
          }
        }

        if (hidden) {
          continue;
        }

        bindings.push({
          layer: state.name,
          key,
          active,
          priority: state.priority,
          ...(description !== undefined && { description }),
        });
      }
    }
    return bindings;
  }
}
