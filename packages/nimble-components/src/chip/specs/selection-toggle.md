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

The chip uses a `selectable` boolean attribute to control whether it exposes toggle behavior.

- **Attribute:** `selectable` (boolean, default: `false`)
    - When absent, the chip is not selectable. It does not have `role="button"` or `aria-pressed`. User-supplied `tabindex` is forwarded to the remove button if removable.
    - When present, the chip's internal toggle button can be toggled on/off via click or Space/Enter keys. The internal button has `role="button"` and `aria-pressed`, and receives `tabindex="0"` unless the user provides a different value.
    - If also removable, the remove button is a sibling of the toggle button and remains keyboard focusable.
    - This API is intentionally local to each chip. It does not imply coordinated single-selection behavior across a group of chips.
- **Attribute:** `selected` (boolean, default: `false`)
    - Indicates the current selection state when `selectable` is set.
    - When `true`, the chip displays with `fillSelectedColor` background.
- **Event:** `selected-change`
    - Emitted when the user toggles the chip state via click or keyboard (Space/Enter).
    - Only emitted when `selectable` is set.
    - `detail` contains the new state: `{ selected: boolean }`.
- **Event:** `remove`
    - Emitted when the user activates the remove button (click) or presses Escape key (when removable and not disabled).

### Keyboard Interaction

- **Space/Enter:** Toggles `selected` state using the internal toggle button (when `selectable` is set).
- **Escape:** Removes the chip (when `removable` and not `disabled`).
    - For non-selectable chips, Escape also works as a convenient alternative to clicking the remove button.
    - **Note:** Escape key is handled on `keydown` to prevent event propagation (e.g., to parent dialogs).

### Accessibility

- **Role:**
    - If `selectable` is not set: No explicit role (generic container).
    - If `selectable` is set: The internal toggle button has `role="button"` with `aria-pressed="true"` or `aria-pressed="false"`.
- **Tabindex Management:**
    - When `selectable` is set: The internal toggle button defaults to `tabindex="0"`. A user-supplied host `tabindex` is forwarded to both the toggle and remove buttons.
    - When `selectable` is not set: The chip does not manage `tabindex`. User-supplied values are forwarded to the remove button if `removable`.
- **Attribute Reflection:**
    - The `selectable` attribute directly reflects whether the chip is interactive.
    - The `selected` attribute reflects local chip state, but only affects accessibility and styling when `selectable` is set.
- **Interactive Controls:** When a chip is both selectable and removable, its toggle and remove buttons are siblings, so each remains independently keyboard and screen-reader accessible. Escape is also available to remove the chip.

### Visual Design

Visual states follow the [Figma design specification](https://www.figma.com/design/PO9mFOu5BCl8aJvFchEeuN/Nimble_Components?node-id=2227-78839&m=dev).

- **Default State:**
    - Border: `rgba(actionRgbPartialColor, 0.3)` for non-selectable chips; `rgba(borderRgbPartialColor, 0.3)` for selectable, unselected, non-block chips
    - Background: transparent
    - Cursor: pointer (when `selectable` is set)
- **Selected State:**
    - Background: `fillSelectedColor`
    - Border: `rgba(actionRgbPartialColor, 0.3)`
- **Hover State** (selectable chips only):
    - Border: `borderHoverColor` (2px green)
    - Outline: 2px green (`borderHoverColor`) at -2px offset (creates 2px green outline appearance)
- **Focus-Visible State** (selectable chips only):
    - Outer: 2px green border (`borderHoverColor`), with 4px corner radius
    - Middle: 1px transparent gap
    - Inner: 1px green border (`borderHoverColor`), with square corners
- **Active State** (selectable chips only, during mousedown/click):
    - Background: `rgba(fillSelectedRgbPartialColor, 0.3)` (30% opacity green)
    - Fill: inset 2px from the outer edge, with 2px corner radius
    - Border: `borderHoverColor` (green)
    - Outline: 1px green at -1px offset
    - **Note:** Active styling is suppressed when the remove button is in mousedown state (via `remove-button-active` attribute)
- **Disabled State:**
    - Text color: `bodyDisabledFontColor`
    - Icons: 30% opacity
    - No hover, focus, or active styling
    - Remove button hidden

### Implementation Details

- **CSS Cascade Layers:** Styles are organized using `@layer base, hover, focusVisible, active, disabled, top` to ensure proper precedence of interactive states.
- **Tabindex Management:**
    - The chip delegates focus to its internal controls and forwards user-supplied tabindex to both buttons without rewriting the host attribute.
    - Forwarded values are preserved when the chip reconnects or changes selectability.
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
    - **Decision:** Rejected. The `selectable` attribute provides a clean API for opt-in behavior without requiring a separate component.

### Alternative 2: `selection-mode` Enum

- Use a `selection-mode` enum with values such as `single`.
    - **Pros:** Leaves room for future expansion.
    - **Cons:** Implies coordinated multi-chip selection behavior that the component does not provide today.
    - **Decision:** Rejected. A boolean `selectable` attribute better matches the chip's local behavior and avoids implying a future container contract.

### Alternative 3: Nested Remove Button

- Keep the remove button inside the toggle button and remove it from the tab order.
    - **Cons:** `tabindex="-1"` does not remove the nested button semantics or make the nested interactive controls valid.
    - **Decision:** Rejected. The toggle and remove buttons are sibling controls.

### Alternative 4: Use AbortController for Event Cleanup

- Use `AbortController` to manage the document mouseup listener instead of storing the handler.
    - **Pros:** Modern JavaScript pattern, automatic cleanup.
    - **Cons:** No precedent in Nimble codebase for this pattern.
    - **Decision:** Rejected. Followed established Nimble pattern of storing handler and cleaning up in `disconnectedCallback()`.

## Open Issues

### Resolved

- ~~Does this affect the `remove` functionality? Can a chip be both selectable and removable?~~
    - **Resolution:** Yes, chips can be both selectable and removable. The toggle and remove buttons are siblings, and Escape is an additional keyboard removal shortcut.
