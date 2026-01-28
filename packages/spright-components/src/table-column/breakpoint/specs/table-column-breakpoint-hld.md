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

## Implementation / Design

The breakpoint column will render a clickable indicator in each row that can cycle through different breakpoint states. 

Typical usage:

```html
<nimble-table>
    <spright-table-column-breakpoint breakpoint-field-name="breakpointState">
        <!-- Column header can be empty or contain accessibility label -->
    </spright-table-column-breakpoint>
    <!-- Other columns -->
</nimble-table>
```

### API

#### Column Element

_Element Name_

- `spright-table-column-breakpoint`

_Props/Attrs_

- `breakpoint-field-name`: string - The field name in the data record that contains the breakpoint state

_Content_

- Typically empty 

_Events_

- `breakpoint-toggle`: Emitted when a breakpoint is toggled via click or keyboard interaction
  ```ts
  interface BreakpointToggleEventDetail {
      recordId: string;
      newState: BreakpointState;
      oldState: BreakpointState;
  }
  ```

- `breakpoint-action`: Emitted for additional breakpoint actions (e.g., right-click, secondary interactions)
  ```ts
  interface BreakpointActionEventDetail {
      recordId: string;
      currentState: BreakpointState;
      actionType: 'secondary-click';
      nativeEvent: Event;
  }
  ```

#### Cell View Element

_Element Name_

- `spright-table-column-breakpoint-cell-view`

_Rendering_

The cell view will render a breakpoint indicator based on the current state:
- **Off**: Empty circular outline (shown on hover)
- **Enabled**: Filled red circle
- **Disabled**: Outlined red circle with slash through it
- **Hit**: Filled red circle with highlight/border indicating active state within the indicator itself

Each indicator will have a minimum 24x24 pixel hit target.

#### Group Header View Element

No new group header view element.

### Sorting / Grouping

The breakpoint column will not be sortable or groupable.

### Sizing

Column will be a fixed width of 32 pixels and will not be resizable.

### Placeholder

When the breakpoint state is `undefined` or `null`, the cell will render in the "Off" state (no visible indicator until hover). 

### Delegated Events

The following events from the cell view will be delegated to the column:

- `click` events from the breakpoint indicator will be delegated as `breakpoint-toggle` events
- `contextmenu` events will be delegated as `breakpoint-action` events with `actionType: 'secondary-click'`

Both events will include the `recordId` to identify the row where the interaction occurred.

### Interactions

The breakpoint indicator will be marked as focusable via the cell view's `tabbableChildren`. The indicator element will properly forward the `tabIndex` value to ensure keyboard accessibility.

Interactive elements:
- Breakpoint indicator button (focusable)

### Test Cases

- Verify breakpoint state transitions (Off ↔ Enabled ↔ Disabled ↔ Hit)
- Test click-to-toggle functionality
- Verify keyboard shortcuts (Ctrl+B, F9) work when row/cell is focused
- Test right-click event delegation for client callback implementation
- Verify tooltip display on hover/focus
- Test accessibility with screen readers
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

### Angular Integration

- Add new table column and events to Angular and Blazor wrappers.

## Open Issues

None