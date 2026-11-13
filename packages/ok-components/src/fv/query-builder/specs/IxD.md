# Query Builder Interaction Design

## Overview

The FV query builder lets users construct filters, apply them to a host
application, and manage reusable saved queries. The query editor can also be
used independently when an application only needs to edit an expression.

### Background

The builder combines a token-based editor with saved-query and optional Nigel
workflows. See the [high-level design](./HLD.md) for the data contracts and
host responsibilities.

## Usage

Use the builder in an application toolbar when users need to compose and apply
filters or manage saved queries. Use the editor alone when the application
provides its own apply, persistence, or surrounding workflow. Neither component
executes a query.

### Anatomy

- The Queries split button opens the query popover or the saved-query menu.
- The popover contains the query editor, optional name and Nigel controls, and
  footer actions. Its action split button offers the primary action and
  alternatives for the current workflow.
- The editor displays condition chips, AND/OR controls, parentheses, an
  insertion caret, and a condition-editing popover.
- A modal confirmation dialog protects saved-query deletion.

### Related Components

The editor uses Nimble controls and FV components, including the multi-select
for static collection choices and date-time picker for date-only values. The
builder supplies the saved-query and apply workflow around the editor.

## Design

### Configuration

The host supplies field and operator definitions, the current query, labels,
and optional option-resolution and saved-query handlers. Nigel, saved-query
creation, editing, and deletion can be enabled independently. The editor
supports inline and formatted layouts; formatted layout indents nested groups
without changing the expression.

### Behavior

#### Editing conditions and expressions

Users insert conditions at the caret using field autocomplete or the Add
condition affordance. A condition chip opens an editor for its field, operator,
and operand; its remove action removes the condition. Changing a field or
operand kind clears an incompatible value; changing an operator with the same
field and operand kind preserves the value and revalidates it.

AND and OR join conditions or groups. Parentheses express explicit grouping,
including nesting up to four levels. Incomplete expressions remain editable
and show validation feedback rather than being presented as valid queries.
The editor retains unfinished number, date, and structured input in the draft.
An empty query is valid and means no filtering.

Closing a condition editor retains its edits. While it is open, the chip
summary remains stable so that editing does not move its popover; it updates
when the popover closes. Value dropdowns must remain usable outside the
condition popover's bounds.

#### Applying and saving

The saved-query menu lists Working query and the saved queries. Switching
selections preserves the draft being left and applies the selected draft when
it is valid; invalid drafts remain available without replacing the applied
query. Dirty indicators identify unsaved work. If the host removes a dirty
saved query, its edits remain available as an unsaved draft without the
removed ID.

In Working query, Apply is the primary action and Save as new opens the
creation workflow. In creation and saved-query edit views, Save is primary and
Apply is available in the action menu. Apply validates and applies without
saving. Save persists first and applies only after success; an unchanged saved
query applies without another save request. Update saved query persists
changes without applying them. Names are required. Persistence failures are
shown and retain the draft for retry.

Cancel closes the popover without applying and retains existing working
drafts; canceling creation restores the source selection. Closing the popover
also retains drafts. Deleting a saved query requires confirmation in a
regular modal `nimble-dialog`; canceling the dialog does not delete it.

#### Nigel

When enabled, Ask Nigel opens a prompt. Sending it requests a generated query
from the host, which may provide a preview for review. The component does not
call an AI service or save generated queries itself.

### Mouse Interactions

Users can click chips to edit, remove conditions with their remove buttons,
toggle logical operators, and use the menus and footer actions. The query
popover is initially anchored to the Queries button and may open above it
when needed. Its header can be dragged to move it and its bottom corner
dragged to resize it. Double-clicking the header restores its anchored
position; closing also resets position while retaining the resized dimensions.
The popover stays within the viewport and scrolls its contents as needed.

### Non-Mouse Interactions

The Queries split button and action split button expose their primary and menu
actions to keyboard users. Condition chips can be activated with Enter or
Space, and their remove controls are separately accessible. The query input
supports token navigation and deletion, autocomplete, and parenthesis entry.
Insertion previews can be activated by keyboard without Tab itself inserting
a token. Escape dismisses the active overlay; closing a condition popover with
Escape returns focus to its chip.

The query popover is a named nonmodal dialog. Focus it with Shift+Tab from its
first control to move it with arrow keys, or resize it with Shift+arrow keys;
arrow keys inside form controls retain their normal behavior. The delete
confirmation is modal and initially focuses Cancel. Labels, expanded states,
dirty indicators, validation messages, and operation errors are exposed to
assistive technology.

## Future Considerations

Backend query translation, authorization, persistence, and AI integration are
host responsibilities. An Angular-specific adapter is not part of this design.
