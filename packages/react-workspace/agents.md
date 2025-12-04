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
