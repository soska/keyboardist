---
"keyboardist": major
---

Keyboardist 3.0 groundwork: modernized build and repo.

- **ESM-only**: the package now ships only ES modules with a proper `exports` map. CommonJS `require()` is no longer supported.
- **Zero dependencies**: the `@jiveworld/minibus` dependency is gone. Subscriptions are handled internally again, restoring the documented behavior that the 2.x minibus refactor had silently broken: subscriptions are scoped per listener instance (no longer shared globally between listeners of the same event type), callbacks receive the `KeyboardEvent`, multiple subscriptions to the same key run last-subscribed-first, and returning `false` from a callback stops propagation.
- **Type changes**: the exported `KeyboardEvent` type alias (which shadowed the DOM type) is now `KeyboardEventName`. New exported types: `SubscriptionCallback`, `MonitorCallback`, `Subscription`.
- `setMonitor(false)` / `setMonitor()` now clears a previously set monitor.
- Node 20.19+ (for tooling; the library itself targets browsers).
