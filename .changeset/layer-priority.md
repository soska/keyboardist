---
"keyboardist": minor
"react-keyboardist": minor
---

Nesting-aware layer priority.

- **keyboardist**: `LayerOptions` gains `priority` (default `0`). Higher-priority layers always sit above lower-priority ones regardless of push order; within a priority, the latest push stays on top (existing behavior unchanged). `Layer.priority` and `getBindings()` expose it.
- **react-keyboardist**: layer priority is now derived from the component tree — nested `<KeyboardLayer>`s (and `<KeyboardScope>`, new, for hook-only composition) win overlapping keys from the inside out, even when the whole tree mounts in one commit. This fixes the inversion where React's child-first effect order put the *outermost* layer on top on initial renders and deep links. Works through portals; an explicit `priority` prop/option overrides the derived depth.
