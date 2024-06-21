# Button Table Column

## Overview

A table column whose cells render an action button (`nimble-button`).

### Background

The primary ask has been from the Systems app to have an icon button that copies some long key related to a pending system. Another potential use case is the ability to mark a row as a "favorite", but the team consensus is that we should have a separate column type for those sorts of stateful use cases.

-   [Table button column (AzDO Feature)](https://ni.visualstudio.com/DevCentral/_workitems/edit/2530349)
-   [nimble-button table column (Nimble issue)](https://github.com/ni/nimble/issues/1582)

### Features

-   Text and/or icon in button
-   Keyboard focusable
-   Fixed-width

### Non-goals

-   Different button configuration per row (i.e. different labels/icons or actions)
    -   We could probably do so by reusing `nimble-mapping-icon` and `nimble-mapping-text`. Buttons would not be uniform, so we would also support sorting, grouping, and resizing. And by depending on a record value, we would also need to consider placeholders.
-   Option to hide buttons except when hovered or row/cell is focused (similar to action menu)
-   Configurable `appearance` or `appearance-variant` attributes (ghost appearance only)
-   Disabled button state
-   Sorting/grouping of column
-   Column resizing

## Implementation / Design

All button configuration is done via attributes on the column element. Every row renders the same thing, so we do not need to access any record data. Icons are referenced by name, the same way as done by the mapping column.

Typical usage (icon-only button):

```html
<nimble-table>
    <nimble-table-column-button
        icon="nimble-icon-arrow-rotate-right"
        button-text="Reboot"
        button-title="Reboot"
        text-hidden
    >
        <!-- no column label -->
    </nimble-table-column-button>
</nimble-table>
```

Icon and text button (with more detailed tooltip):

```html
<nimble-table>
    <nimble-table-column-button
        icon="nimble-icon-arrow-rotate-right"
        button-text="Reboot"
        button-title="Reboot the system. All temporary configuration will be lost."
    >
        <!-- no column label -->
    </nimble-table-column-button>
</nimble-table>
```

### API

#### Column Element

_Element Name_

-   `nimble-table-column-button`

_Props/Attrs_

-   `button-text`: string - Text displayed on the button. If `text-hidden` is set, the text is hidden, but still serves as the accessible name of the button.
-   `button-title`: string - Text used for the `title` (tooltip) of the button. For an icon-only button (i.e. `text-hidden` is set), this should typically have the same value as `button-text`.
-   `icon`: string - Tag name of the Nimble icon to render on the button.
-   `text-hidden`: boolean - When set, the button is styled such that only the icon is visible.

_Content_

-   default slot - Column label (icon and/or text)

_Events_

-   `button-column-click` - Emitted when a button in the column is activated either by keyboard or mouse.

The detail for the event is:

```ts
interface ButtonColumnClickEventDetail extends PointerEvent {
    recordId: string;
}
```

#### Cell View Element

_Element Name_

-   `nimble-table-column-button-cell-view`

_Rendering_

Renders a ghost button with the configured text and/or icon.

#### Group Header View Element

The column does not support grouping, so no group header view element is needed.

### Sorting / Grouping

Because every cell in the column is identical, there is no reason to support sorting or grouping.

### Sizing

Because every cell in the column is identical, there is no reason to support resizing. The column will have a fixed width equal to the rendered width of the buttons. If the client configures a column label that exceeds the button width, it will be ellipsized with a tooltip that shows the full column label. We will document a recommendation that the column label should not be wider than the button content.

### Placeholder

The column does not depend on any record values, so a placeholder for `null`/`undefined` values is not applicable.

### Delegated Events

Button `click` events will be delegated to the column, and the column will handle the `delegated-event` event by firing a `button-column-click` event. The event detail for `button-column-click` will augment the original `click` event detail with the `recordId` indicating which row originated the click.

### Interactions

The buttons are interactive, so the cell view's `tabbableChildren` getter will return the button element. The cell view will configure the button element with `tabindex=-1`. (`nimble-button` properly forwards its `tabIndex` property value to the native `button` in the shadow DOM.)

The `nimble-table-column-button-cell-view` will configure a click handler that stops propagation to prevent button clicks from affecting row selections.

### Test Cases

-   Typical visual tests that exercise combinations of icons and text.
-   Interaction state visual tests (hover, hover + active, focused).

### Internationalization

No special considerations.

### Accessibility

`button-text` should always be configured on the column, even for icon-only buttons, for the sake of accessibility. This will be documented. _[QUESTION: Should we add a validator and enforce that this is provided?]_

### Angular Integration

An Angular wrapper will be created for the component. There are no special considerations for Angular.

### Blazor Integration

A Blazor wrapper will be created for the component. There are no special considerations for Blazor.

## Open Issues

See inline "_[QUESTION: ...]_" notes.
