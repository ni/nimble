# Chip Selection Toggle

## Problem Statement

The `nimble-chip` component currently lacks a built-in mechanism to represent a selected or toggled state. This feature is required to support use cases where chips act as filter toggles or selectable items in a list. This design proposes adding a selection state to the `nimble-chip`.

## Links To Relevant Work Items and Reference Material

- [Nimble Chip Component](../index.ts)
- [Figma Design - Chip Interactive States](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&m=dev)
- [ARIA: button role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role) (specifically `aria-pressed`)
- [WCAG 4.1.2: Name, Role, Value](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html) (nested interactive controls)

## Implementation / Design

### API Proposal

The chip uses the `selection-mode` attribute to control whether the chip is selectable.

- **Attribute:** `selection-mode` (enum: `none` (default: `undefined`) | `single` (`'single'`))
    - `none`: The chip is not selectable. Does not have `role="button"` or `aria-pressed`. User-supplied `tabindex` is forwarded to the remove button if removable.
    - `single`: The chip can be toggled on/off via click or Space/Enter keys. Has `role="button"` and `aria-pressed`. Automatically receives `tabindex="0"` unless user provides a different value.
- **Attribute:** `selected` (boolean, default: `false`)
    - Indicates the current selection state when `selection-mode="single"`.
    - When `true`, the chip displays with `fillSelectedColor` background.
- **Event:** `selected-change`
    - Emitted when the user toggles the chip state via click or keyboard (Space/Enter).
    - Only emitted when `selection-mode="single"`.
- **Event:** `remove`
    - Emitted when the user activates the remove button (click) or presses Escape key (when removable and not disabled).

### Keyboard Interaction

- **Space/Enter:** Toggles `selected` state (when `selection-mode="single"`).
    - **Note:** Enter key is handled on `keydown` to match native button behavior. Space key is handled on `keyup` to allow for active state styling.
- **Escape:** Removes the chip (when `removable` and not `disabled`).
    - When the chip is selectable (`selection-mode="single"`), the remove button is set to `tabindex="-1"` to avoid a WCAG 4.1.2 violation (nested interactive controls). The Escape key provides keyboard access to the remove functionality in this case.
    - For non-selectable chips, Escape also works as a convenient alternative to clicking the remove button.
    - **Note:** Escape key is handled on `keydown` to prevent event propagation (e.g., to parent dialogs).

### Accessibility

- **Role:**
    - If `selection-mode="none"`: No explicit role (generic container).
    - If `selection-mode="single"`: `role="button"` with `aria-pressed="true"` or `aria-pressed="false"`.
- **Tabindex Management:**
    - When `selection-mode="single"`: The chip automatically manages its own `tabindex` (defaults to `0`). User-supplied values are preserved.
    - When `selection-mode="none"`: The chip does not manage `tabindex`. User-supplied values are forwarded to the remove button if `removable`.
- **Nested Interactive Controls:** To comply with WCAG 4.1.2, when a chip is both selectable and removable, the remove button is set to `tabindex="-1"` (not keyboard-focusable). The Escape key provides keyboard access to the remove functionality for all removable chips.

### Visual Design

Visual states follow the [Figma design specification](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&m=dev).

- **Default State:**
    - Border: `rgba(actionRgbPartialColor, 0.3)` for selectable chips; `rgba(borderRgbPartialColor, 0.3)` for non-selectable, non-block appearance
    - Background: transparent
    - Cursor: pointer (when `selection-mode="single"`)
- **Selected State:**
    - Background: `fillSelectedColor`
    - Border: `rgba(actionRgbPartialColor, 0.3)`
- **Hover State** (selectable chips only):
    - Border: `borderHoverColor` (2px green)
    - Outline: 2px green (`borderHoverColor`) at -2px offset (creates 2px green outline appearance)
- **Focus-Visible State** (selectable chips only):
    - 3-ring effect using layered box-shadows:
        - Outer: 2px green border (`borderHoverColor`)
        - Middle: 2px white ring (`applicationBackgroundColor` inset)
        - Inner: 1px green ring (`borderHoverColor` inset)
- **Active State** (selectable chips only, during mousedown/click):
    - Background: `rgba(fillSelectedRgbPartialColor, 0.3)` (30% opacity green)
    - Border: `borderHoverColor` (green)
    - Outline: 1px green at -1px offset
    - Box-shadow: 1px white ring inset
    - **Note:** Active styling is suppressed when the remove button is in mousedown state (via `remove-button-active` attribute)
- **Disabled State:**
    - Text color: `bodyDisabledFontColor`
    - Icons: 30% opacity
    - No hover, focus, or active styling
    - Remove button hidden

### Implementation Details

- **CSS Cascade Layers:** Styles are organized using `@layer base, hover, focusVisible, active, disabled, top` to ensure proper precedence of interactive states.
- **Tabindex Management:**
    - The chip tracks whether it's managing tabindex via internal `managingTabIndex` flag.
    - When `selection-mode` changes or the chip connects/disconnects, `updateManagedTabIndex()` is called.
    - User-supplied tabindex values are preserved by detecting attribute changes that didn't originate from internal management.
- **Remove Button Active State:**
    - The `remove-button-active` attribute is set during remove button mousedown to prevent chip active styling from appearing.
    - A document-level mouseup listener clears this state, ensuring it works even if the mouse moves outside the chip.
    - The listener is cleaned up in `disconnectedCallback()` to prevent memory leaks.
- **Event Propagation:**
    - `click`, `keydown` (Enter/Escape), and `keyup` (Space) handlers call `stopPropagation()` when they successfully handle an event. This prevents unintended side effects in parent containers (e.g., closing a dialog when removing a chip, or triggering a parent click handler when toggling selection).

## Alternative Implementations / Designs

### Alternative 1: New Component

- Create a `nimble-toggle-chip` instead of modifying `nimble-chip`.
    - **Pros:** Separation of concerns. `nimble-chip` stays simple (just for display/dismiss).
    - **Cons:** Code duplication. Users might expect `nimble-chip` to handle this common case.
    - **Decision:** Rejected. The `selection-mode` attribute provides a clean API for opt-in behavior without requiring a separate component.

### Alternative 2: Focusable Remove Button (Initial Implementation)

- Make the remove button keyboard-focusable when the chip is selectable and removable.
    - **Pros:** Direct keyboard access to remove button matches mouse interaction.
    - **Cons:** Violates WCAG 4.1.2 (nested interactive controls - a button within a button).
    - **Decision:** Rejected. Implemented Escape key pattern instead to maintain accessibility compliance.

### Alternative 3: Use AbortController for Event Cleanup

- Use `AbortController` to manage the document mouseup listener instead of storing the handler.
    - **Pros:** Modern JavaScript pattern, automatic cleanup.
    - **Cons:** No precedent in Nimble codebase for this pattern.
    - **Decision:** Rejected. Followed established Nimble pattern of storing handler and cleaning up in `disconnectedCallback()`.

## Open Issues

### Resolved

- ~~Does this affect the `remove` functionality? Can a chip be both selectable and removable?~~
    - **Resolution:** Yes, chips can be both selectable and removable. When both are true, the chip uses the Escape key for keyboard removal to avoid nested interactive controls (WCAG 4.1.2 violation).
