# Nimble Component (IxD): Breakpoint

## Overview

A breakpoint is a UI element that visually marks a line or section of code allowing developers to pause execution and inspect the application state during debugging. In a code table or editor, breakpoints help users quickly identify and interact with debugging points.

### Background
Requested by TS Web OI team to support code inspection and debugging workflows in Nimble Table.

## Usage

Use with the Nimble Table when displaying code, especially in environments where debugging is required.

- **When should client-users not use this component?**
  - When displaying static code with no debugging functionality.
  - In tables not intended for code or debugging workflows.

### Anatomy
- *What parts make up this component?*
- *How should client-users use the component parts?*

### Related Components

- **Differs from:**
  - **Toggle buttons**  
    - Toggle buttons are used to switch between two states for a setting or feature, typically representing on/off or enabled/disabled.  
    - Breakpoints specifically mark a location in code for debugging purposes and are contextually tied to code execution, not general UI state changes.

- **Decision guidance:**
  - Use breakpoints for debugging; use toggle buttons for general UI state changes.

## Design

### Configuration
*What types of options need to be available on the component to support client-user use cases?*

### Behavior

- **Built-in behaviors:**
  - Toggle breakpoint on click/tap
  - Show tooltip on hover/focus
  - Visually indicate active/inactive state
  - Optionally highlight code line when active

### Mouse Interactions

- Click on the breakpoint indicator toggles its state (set/remove).
- Hovering shows a tooltip with breakpoint details.
- Drag-and-drop (optional): Move breakpoint to another line.

### Non-Mouse Interactions

- **ARIA Guidelines:** [ARIA Practices: Switch](https://www.w3.org/WAI/ARIA/apg/patterns/switch/)
- Keyboard navigation:
  - Tab to breakpoint indicator
  - Space/Enter toggles breakpoint
  - Tooltip appears on focus
- **Keyboard Shortcuts:**
  - **Add/Remove breakpoint:**  
    - On Mac: <kbd>Cmd</kbd> + <kbd>B</kbd>  
    - On Windows/Linux: <kbd>Ctrl</kbd> + <kbd>B</kbd>
    - Alternatively, pressing <kbd>F9</kbd> when focused on a code line toggles the breakpoint (common in IDEs).
- **Accessibility:**
  - `role="switch"` for toggleable indicator
  - `aria-checked` reflects active state
  - Ensure sufficient contrast and focus ring

## Open Issues

- Should breakpoints persist across sessions?
- Should breakpoints support conditional logic (e.g., only break when a condition is met)?
- How to handle breakpoints in read-only code tables?

## Future Considerations

- Support for conditional breakpoints
- Integration with external debuggers
- Multi-language support for code tables
- Visual grouping of breakpoints for batch operations

