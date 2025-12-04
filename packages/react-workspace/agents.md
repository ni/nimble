# Nimble React – AI Instructions

## Overview
React wrappers for Nimble Web Components.
- **Status**: Alpha / Experimental
- **Pattern**: `useLayoutEffect` for events, `forwardRef` for DOM access.

## Key References
- `README.md` – Current status.

## Core Patterns
- Ensure custom elements are registered before use.
- Use `useLayoutEffect` to attach event listeners to custom events.
- Forward refs to the underlying DOM element.

## Common Pitfalls
- ❌ **`useEffect` for Events**: Use `useLayoutEffect` to avoid timing issues with custom elements.
- ❌ **Missing Ref Forwarding**: Wrappers must forward refs to the underlying web component.
- ❌ **ClassName Conflicts**: Ensure `className` prop is merged correctly.
