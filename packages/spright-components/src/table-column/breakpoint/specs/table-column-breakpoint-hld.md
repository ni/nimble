# Table Column Breakpoint

## Overview

The breakpoint table column provides a visual indicator for debugging breakpoints in code-centric table displays.

### Background

[IxD](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table-column/breakpoint/IxD.md)

### Features

- Visual breakpoint indicators with multiple states (Off, Enabled, Disabled, Hit)
- Click-to-toggle functionality for setting/removing breakpoints
- Callback mechanisms for client-implemented breakpoint operations (like row highlighting and context menu, as specified in IxD)
- Keyboard shortcuts for breakpoint management (Ctrl+B, F9)
- Tooltip display for breakpoint actions

### Non-goals

- Debugging functionality or integration with debugger engines
- Sorting or grouping capabilities
- Resizable column width
- Context menu for disabling or enabling breakpoints
- Updates to the nimble table to modify column ordering or pin columns
- Implementing keyboard shortcuts

## Implementation / Design

The breakpoint column will render a clickable indicator in each row that can cycle through different breakpoint states. 

Typical usage:

```html
<nimble-table>
    <ok-table-column-breakpoint field-name="breakpointState">
        <!-- Column header can be empty or contain accessibility label -->
    </ok-table-column-breakpoint>
    <!-- Other columns -->
</nimble-table>
```

### API

#### Column Element

_Element Name_

- `ok-table-column-breakpoint`

_Props/Attrs_

- `field-name`: string - The field name in the data record that contains the breakpoint state

_Content_

- Column label (icon and/or text), typically empty

_Events_

- `breakpoint-column-toggle`: Emitted when a breakpoint is toggled via click or keyboard interaction
  ```ts
  interface BreakpointToggleEventDetail {
      recordId: string;
      newState: BreakpointState;
      oldState: BreakpointState;
  }
  ```

#### Cell View Element

_Element Name_

- `ok-table-column-breakpoint-cell-view`

_Rendering_

The cell view will render a breakpoint indicator based on the current state:
- **Off**: Empty circular outline (shown on hover)
- **Enabled**: Filled red circle
- **Disabled**: Outlined red circle with slash through it
- **Hit**: Filled red circle with highlight/border indicating active state within the indicator itself

Each indicator will have a minimum 24x24 pixel hit target.

_DOM / Hit Target_

The indicator will be implemented as a native `<button>` with a fixed 24x24 hit target. The button will be visually transparent (no background, border, or shadow) so only the breakpoint icon is visible. The icon for the current state will be slotted inside the button. 

#### Breakpoint States

The breakpoint state is represented as an enum with the following values:

```ts
enum BreakpointState {
    Off = 'off',
    Enabled = 'enabled',
    Disabled = 'disabled',
    Hit = 'hit'
}
```

### Sorting / Grouping

The breakpoint column will not be sortable or groupable. No new group header view element.

### Sizing

Column will be a fixed width of 32 pixels and will not be resizable.

### Placeholder

When the breakpoint state is `undefined` or `null`, the cell will render in the "Off" state (no visible indicator until hover). 

### Delegated Events

The following events from the cell view will be delegated to the column:

- `breakpoint-column-toggle`

The event will include the `recordId` to identify the row where the interaction occurred.

### Interactions

The breakpoint indicator will be marked as focusable via the cell view's `tabbableChildren`. The indicator element will properly forward the `tabIndex` value to ensure keyboard accessibility.

Interactive elements:
- Breakpoint indicator button (focusable)

### Test Cases

- Verify breakpoint state transitions (Off ↔ Enabled ↔ Disabled ↔ Hit)
- Test click-to-toggle functionality
- Verify tooltip display on hover/focus
- Verify proper event delegation with correct recordId values
- Test that column appears leftmost in table layout
- Verify non-resizable behavior
- Test with various data states (undefined, null, invalid values)
- Verify callback events provide proper context for client implementations

### Internationalization

Tooltips will use the standard HTML `title` attribute, with built-in default text ("Add breakpoint" / "Remove breakpoint"). If applications need custom tooltip text, they can override the `title` attribute on the column element. This follows the same pattern as other nimble components.

### Accessibility

- Breakpoint indicators will have proper ARIA labels describing current state
- Keyboard navigation support with Tab/Shift+Tab
- Space/Enter key activation for toggling breakpoints
- Tooltips will be announced by screen readers
- High contrast support for different breakpoint states
- Minimum 24x24 pixel hit targets for web accessibility

### Framework Integration

- Standard Blazor wrapper

## Open Issues

None