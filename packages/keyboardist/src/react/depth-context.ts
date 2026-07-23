import { createContext } from "react";

// Tracks how deep in the component tree a layer sits. Layer priority is
// derived from this depth, so the JSX nesting — not React's child-first
// effect order — decides which layer wins overlapping keys. Flows through
// portals, so a portaled modal keeps its logical nesting priority.
export const KeyboardDepthContext = createContext(0);
