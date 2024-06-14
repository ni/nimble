# Menu Button Table Column HLD

## Overview

In some tables, the user needs to make a selection associated with a cell in the table. For example, in a table of software packages where there is a column for the software version to install, the user needs to select a version for each software package. The selection and options can vary between records.

### Background

[GitHub issue: Research and spec for select-like input table column (#1872)](https://github.com/ni/nimble/issues/1872)

### Features

-   Add `nimble-menu-button` to a cell where the text on the menu button is populated from the table row's record
-   Allow a client application to specify custom menu items for each menu button instance

### Non-goals

-   Support client-specified icons in the menu button, including icon-only menu buttons
-   Allow configuration of the menu button's `appearance` or `appearance-variant`
-   Having the table or the column automatically update the row's record when an item in the menu is activated.
    -   If a record needs to be updated, the expectation is that this will be done within client code in reaction to an event fired by the menu items.

## Implementation / Design

The `nimble-table-column-menu-button` will follow many of the API patterns established by the table's action menu. Part of the menu button column's configuration will be the name of the slot where the menu associated with the menu button will be provided, say `software-version-menu`. The client will slot their menu into the table using the slot name they configured on the column; in this case, `software-version-menu`. The table, along with all of its subcomponents, will be responsible for coordinating the slotting of the menu into the appropriate row and cell when a menu button becomes open. If the client needs different menu items depending on which menu button is open, they can update the menu items within their slotted menu in reaction to the `menu-button-column-beforetoggle` event firing from the column.

Usage of the column would look as follows:

```html
<nimble-table>
    <nimble-table-column-menu-button
        field-name="selectedVersion"
        menu-slot="software-version-menu"
    >
        Software version
    </nimble-table-column-menu-button>

    <nimble-menu slot="software-version-menu">
        <nimble-menu-item>1.0.0</nimble-menu-item>
        <nimble-menu-item>1.5.0</nimble-menu-item>
        <nimble-menu-item>2.0.0</nimble-menu-item>
    </nimble-menu>
</nimble-table>
```

Because the menu will only be shown for one menu button at a time, the same slot and menu element can be shared across menu button columns and action menus. For example:

```html
<nimble-table>
    <nimble-table-column-text
        field-name="packageName"
        action-menu-slot="table-menu"
    >
        Name
    </nimble-table-column-text>
    <nimble-table-column-menu-button
        field-name="selectedBitness"
        menu-slot="table-menu"
    >
        Bitness
    </nimble-table-column-menu-button>
    <nimble-table-column-menu-button
        field-name="selectedVersion"
        menu-slot="table-menu"
    >
        Version
    </nimble-table-column-menu-button>

    <nimble-menu slot="table-menu">
        <!-- Items dynamically updated based on the column & record associated with the open menu -->
    </nimble-menu>
</nimble-table>
```

### API

#### Column Component

_Component Name_

-   `nimble-table-column-menu-button`

_Props/Attrs_

-   `field-name`: string - The name of the field in each record that contains the string that will be displayed in the menu button
-   `menu-slot`: string - The name of the slot within the `nimble-table` instance where the menu associated with the column's menu button will be provided
-   `fractional-width`: number (defaults to 1)
-   `min-pixel-width`: number (defaults to minimum supported by table)

_Content_

-   column title (icon and/or text)

_Events_

-   `menu-button-column-beforetoggle`: Fired when a menu button in a cell fires the `beforetoggle` event
-   `menu-button-column-toggle`: Fired when a menu button in a cell fires the `toggle` event

The detail for each of these events will be as follows:

```ts
interface MenuButtonColumnToggleEventDetail
    extends MenuButtonToggleEventDetail {
    recordId: string;
}
```

#### Cell View Component

_Component Name_

-   `nimble-table-column-menu-button-cell-view`

_Rendering_

If the record value associated with the specified `field-name` is a non-empty string, the cell will render a menu button containing the record value text. If the record value associated with the specified `field-name` is not a non-empty string, the cell will render nothing.

The menu button will have the following behaviors/styles:

-   Use `ghost` appearance mode
-   Have `nimble-icon-arrow-expander-down` slotted into the `end` slot
-   Grow to fill the width of the cell
-   Left-align the text (with padding) in the button to make the text within each button is aligned for a given column
    -   By default, button text is centered, so custom styling will be written to handle this case.
-   Ellipsize text in the button if it doesn't fit in the button
-   Provide the full text within the button's `title` if the text is ellipsized
    -   It is unlikely this can leverage the existing `overflow` directive as-is because the overflow will occur on the text within a `span` within the button, but the `title` should be added when the button is hovered. The best solution to this problem will be determined during implementation.

#### Group Header View Component

A new component will not be created for the group header view of the menu button column. The column will specify the existing `tableColumnTextGroupHeaderViewTag` as the `groupHeaderViewTag` because the header will contain only text.

### Sorting & Grouping

The column will not be sortable or groupable.

### Placeholder

The column's cells will not have a placeholder. If an empty, `undefined`, or `null` value is provided for the record, an empty cell will be rendered.

Group rows will display `tableGroupRowPlaceholderNoValueLabel` when the value is `undefined` or `null` and `tableGroupRowPlaceholderEmptyLabel` when the value is an empty string. This group row placeholder behavior already exists in the `TableColumnTextGroupHeaderView`, so no changes are required to achieve this behavior.

### Delegated Events

The cell will delegate the `beforetoggle` and `toggle` events from the menu button through the column's `delegated-event` event. The column will listen for the `delegated-event` event, and it will fire the `menu-button-column-beforetoggle` event when it recieves a delegated event for `beforetoggle` on the menu button and will fire the `menu-button-column-toggle` event when it recieves a delegated event for `toggle` on the menu button.

The `menu-button-column-beforetoggle` and `menu-button-column-toggle` event detail will extend the menu button's event detail with an additional `recordId` property to indicate which menu button was toggled. When the menu button's toggle events are updated to be cancellable, the menu button column's toggle events will also be made cancellable so that the toggle events can be cancelled within the table (see [nimble issue #1157](https://github.com/ni/nimble/issues/1157)).

### Focus Recycling

Because the menu button in the cell can have focus, we must override `focusedRecycleCallback()` in our cell view and have it call `blur()` on the button. If we don't, the focus can pass to other cells as you scroll.

Note, there are open issues associated with scrolling, keyboard navigation, and focus recycling with the menu button.

### Sizing

The column will support fractional width sizing along with a minimum pixel width.

### Interactions

When the menu button is focused, it will have the same keyboard interactions as the `nimble-menu-button` outside of a table. Interacting with the menu button and its slotted menu, whether via keyboard or mouse, will not modify the selection in the table.

### Accessibility

If the text of the button does not fit fully in the button, it will be ellipsized and the button's `title` will be set to the full text.

All other accessibility needs are already implemented by the table, menu button, and menu.

### Angular integration

An Angular wrapper will be created for the component. There are no special considerations for Angular.

### Blazor integration

A Blazor wrapper will be created for the component. There are no special considerations needed for Blazor.

### API Updates to Existing Table Components

Multiple API changes need to be made to the table, its subcomponents, and the classes it uses to facilitate slotting a menu through the table and into a specific cell view. This includes the following:

-   The `ColumnInternalsOptions` interface will be updated to include an optional string array named `slotNames`, which allows a column to specify the names of any slots that need to be forwarded into a cell.
-   As with the `ColumnInternalsOptions`, the `ColumnInternals` class will be updated to have a `slotNames` array that specifies the names of any slots that need to be forwarded into a cell. The value will be readonly and will be populated by the `ColumnInternalsOptions` `slotNames` property. It will default to an empty array if a value is not provided in `ColumnInternalsOptions`.
-   Add slots to component templates:
    -   table template - slots created within each table row element that has most recently requested the slot
        -   slot's name: specified by client's column configuration (e.g. `software-version-menu`)
        -   slot's slot: _unique-column-id_ + _column-requested-slot-name from column internal's slotNames array_ (e.g. table-column-slot2-menu)
    -   row template - slots created within each table row element for each slot name that is specified in the column's `ColumnInternals.slotNames` array
        -   slot's name: _unique-column-id_ + _column-requested-slot-name from column internal's slotNames array_ (e.g. table-column-slot2-menu)
        -   slot's slot: _unique-column-id_ + _column-requested-slot-name from column internal's slotNames array_ (e.g. table-column-slot2-menu)
    -   cell view, created via `createCellViewTemplate` - slots created within the cell view
        -   slot's name: _unique-column-id_ + _column-requested-slot-name from column internal's slotNames array_ (e.g. table-column-slot2-menu)
        -   slot's slot: _column-requested-slot-name from column internal's slotNames array_ (e.g. menu)
    -   menu button column cell view - slot created within the menu button component
        -   slot's name: _column-requested-slot-name from column internal's slotNames array_ (e.g. menu)
        -   slot's slot: `"menu"`, which is the slot name required by the `nimble-menu-button` comonent
-   Add events to pass slot information between cell views, rows, and the table:
    -   `cell-view-slots-request` event
        -   Fired by cell view instances if they want to request that the column's slots to be placed within that cell. For example, the menu button column's cell view will fire this event when the cell's `menu-button` fires a `beforetoggle` event with the `newState` as `true`.
        -   Handled by table rows. When handling this event, a table row will fire the `row-slots-request` event to request the table to slot the necessary elements within the row.
        -   Event details:
            <!-- prettier-ignore -->
            ```ts
            interface CellViewSlotRequestEventDetail {
                slots: { slot: string, name: string }[];
            }
            ```
    -   `row-slots-request` event
        -   Fired by table rows to request that column's slots to be placed within that row. This event is fired in response to the row recieving a `cell-view-slots-request` event fired by one of its cell views.
        -   Handled by table. When handling this event, the table will update its template to move the appropriate slots into the correct table row.
        -   Event details:
            <!-- prettier-ignore -->
            ```ts
            interface RowSlotRequestEventDetail {
                columnInternalId: string;
                rowId: string;
                slots: { slot: string, name: string }[];
            }
            ```

In addition to the slotting changes needed within the table, updates also need to be made to disable sorting on this column. Specifically, the sorting properties of `sortDirection`, `sortIndex`, and `sortingDisabled` will be moved out of the base `TableColumn` class and into a mixin that all existing columns will leverage.

## Alternative Implementations / Designs

_Alternative #1_

Rather than creating a menu button column, we could create a select column. However this has a number of challenges steming from the fact that the `nimble-select` has a different slotting model than the `nimble-menu-button`. As a result, it would be very difficult have an API that allows providing unique options for each record without a significant redesign of the select. Additionally, the `nimble-select` has interactions that allow the value to be changed without the component being open. This poses a challenge of handling all the cases where a given select's options need to be updated.

## Open Issues

-   There is no visual design spec for this feature yet. Therefore there are a few open visual design questions, including the following:
    -   If we only support one appearance for the menu-button, is `ghost` the appropriate one to support?
    -   Is there any concern that the button text will not align with the column header because of the padding between the edge of the button and the text within the button?
-   If the menu is open in a cell, it needs to be closed when scrolling. However, the `focusedRecycleCallback()` doesn't provide the appropriate hook to do this today. The problem appears to be that the menu has focus when the menu button is open, which means the focus isn't actually in the cell view -- it's in the menu slotted into the cell view. We need to come up with a plan to address this.
-   There may be additional work to integrate this column with the table keyboard navigation work that is currently in progress.
