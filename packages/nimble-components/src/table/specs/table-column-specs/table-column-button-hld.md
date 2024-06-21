# Button Table Column

## Overview

A table column whose cells render an action button (`nimble-button`).

### Background

The primary ask has been from the Systems app to have an icon button that copies some long key related to a pending system. Another potential use case is the ability to mark a row as a "favorite", but it is not clear if we should have a separate toggle-button column type for those sorts of stateful use cases.

-   [Table button column (AzDO Feature)](https://ni.visualstudio.com/DevCentral/_workitems/edit/2530349)
-   [nimble-button table column (Nimble issue)](https://github.com/ni/nimble/issues/1582)

### Features

-   Text and/or icon(s) in button
-   Option to hide buttons except when hovered or row/cell is focused (similar to action menu)
-   Keyboard focusable
-   Fixed-width

### Non-goals

-   Different button configuration per row (i.e. different labels/icons or actions)
    -   State-based configuration (e.g. to emulate toggle button) _[QUESTION: Should we support this? We could probably do so by reusing `nimble-mapping-icon` and `nimble-mapping-text`. If we support this, then buttons will no longer be uniform, so we should also support sorting, grouping, and resizing. And by depending on a record value, we would also need to reconsider placeholders.]_
-   Configurable `appearance` or `appearance-variant` attributes (ghost appearance only)
-   Disabled button state
-   Sorting/grouping of column
-   Column resizing

## Implementation / Design

The general approach is to treat the column element as a proxy for the button elements. I.e. attributes that would normally be configured on the button are configured on the column, and elements that would be provided to the button as content are instead column content. Where this breaks down is the text content, which is still used to configure the column label rather than the button label. A new `button-text` attribute is used instead. _[QUESTION: Should we even support column labels for this column? If not, we could use the column content for the button label instead of using a separate attribute.]_

Typical usage (icon-only button):

```html
<nimble-table>
    <nimble-table-column-button
        button-text="Reboot"
        button-title="Reboot"
        content-hidden
        hide-unless-focused
    >
        <!-- no column label -->
        <nimble-icon-arrow-rotate-right
            slot="start"
        ></nimble-icon-arrow-rotate-right>
    </nimble-table-column-button>
</nimble-table>
```

Text/icon button:

```html
<nimble-table>
    <nimble-table-column-button
        button-text="Reboot"
        button-title="Reboot the system. All temporary configuration will be lost."
        hide-unless-focused
    >
        <!-- no column label -->
        <nimble-icon-arrow-rotate-right
            slot="start"
        ></nimble-icon-arrow-rotate-right>
    </nimble-table-column-button>
</nimble-table>
```

### API

#### Column Element

_Element Name_

-   `nimble-table-column-button`

_Props/Attrs_

-   `button-text`: string - Text displayed on the button. If `content-hidden` is set, the text is hidden, but still serves as the accessible name of the button.
-   `button-title`: string - Text used for the `title` (tooltip) of the button. If `content-hidden` is set, then this should typically have the same value as `button-text`.
-   `content-hidden`: boolean - When set, the button text and end slot are hidden, leaving only the start slot visible.
-   `hide-unless-focused`: boolean - When set, cells render as empty except when the cell is hovered, focused, or the containing row is focused. Used to reduce visual clutter in the table. _[QUESTION: Should this be the default behavior?]_

_Content_

-   default slot - Column label (icon and/or text)
-   `start` slot - Icon to render in the `start` slot of each button
-   `end` slot - Icon to render in the `end` slot of each button

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

Renders a ghost button with the configured text and/or icons. If `hide-unless-focused` was set on the column, then a blank cell is rendered except when the cell is hovered/focused or the row is focused.

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

-   Typical visual tests that exercise combinations of start/end icons and text, as well as the `hide-unless-focused` attribute.

### Internationalization

No special considerations.

### Accessibility

`button-text` should always be configured on the column, even for icon-only buttons, for the sake of accessibility. This will be documented. _[QUESTION: Should we add a validator and enforces that this is provided?]_

### Angular Integration

An Angular wrapper will be created for the component. There are no special considerations for Angular.

### Blazor Integration

A Blazor wrapper will be created for the component. There are no special considerations for Blazor.

## Open Issues

See inline "_[QUESTION: ...]_" notes.
