import { MinibusCallback, MinibusUnsubscriber } from "@jiveworld/minibus";
export declare type KeyboardEvent = "keydown" | "keyup";
export interface KeyboardistListener {
    subscribe: (name: string, callback: MinibusCallback) => MinibusUnsubscriber;
    setMonitor: (monitor?: MinibusCallback | Boolean) => void;
    startListening: () => void;
    stopListening: () => void;
}
export declare function createListener(listenForEvent?: KeyboardEvent, element?: Document | Element | null): false | KeyboardistListener;
