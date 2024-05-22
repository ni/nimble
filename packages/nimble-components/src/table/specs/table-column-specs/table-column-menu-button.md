# Menu Button Table Column HLD

## Overview

In some tables, the user needs to make a selection associated with cell in the table. For example, in a table of software packages where there is a column for the software version to install, the user needs to select a version for each software package. The selection and options can vary between records.

### Background

[GitHub issue: Research and spec for select-like input table column (#1872)](https://github.com/ni/nimble/issues/1872)

### Features

-   Add `nimble-menu-button` to a cell where the text on the menu button is populated from the table row's record
-   Allow a client application to specify custom menu items for each menu button instance

### Non-goals

-   Support client-specified icons in the menu button, including icon-only menu buttons
-   Allow configuration of the menu button's `appearance` or `appearance-variant`
-   Automatically updating the row's record when an item in the menu is activated

## Implementation / Design

The `nimble-table-column-menu-button` will follow many of the API patterns established by the table's action menu. A client will configure a column with the name of the slot to find the menu associated with the menu button, say `software-version-menu`. The client will also slot their menu into the table using the slot name they configured on the column; in this case, `software-version-menu`. The table, along with all of its subcomponents, will be responsible for coordinating the slotting of the menu into the appropriate row and cell when a menu button becomes open. If the client needs different menu items depending on which menu button is open, they can update the menu items within their slotted menu in reaction to the `delegated-event` event firing from the table. In the case of a menu button opening or closing, the original event's details will be an instance of `MenuButtonToggleEventDetail`.

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

### API

#### Column Component

_Component Name_

-   `nimble-table-column-menu-button`

_Props/Attrs_

-   `field-name`: string - The name of the field in a record that contains the string that will be displayed in the menu button.
-   `menu-slot`: string - The name of the slot within the `nimble-table` instance where the menu associated with the column's menu button will be provided
-   `fractional-width`: number (defaults to 1)
-   `min-pixel-width`: number (defaults to minimum supported by table)

_Content_

-   column title (icon and/or text)

#### Cell View Component

_Component Name_

-   `nimble-table-column-menu-button-cell-view`

_Rendering_

If the record value associated with the specified `field-name` is a non-empty string, the cell will render a menu button containing the record value text. If the record value associated with the specified `field-name` is not a non-empty string, the cell will render nothing.

The menu button will have the following behaviors/styles:

-   Use `ghost` appearance mode
-   Have `nimble-icon-arrow-expander-down` slotted into the `end` slot
-   Grow to fill the width of the cell
-   Left-align the text (with padding) in the button. By default, button text is centered, but custom styling will be written to handle this case so that the text within each button is aligned for a given column.
-   Ellipsize text in the button if it doesn't fit in the button.

#### Group Header View Component

A new component will not be created for the group header view of the menu button column. The column will specify the existing `tableColumnTextGroupHeaderViewTag` as the `groupHeaderViewTag` because the header will contain only text.

### Sorting & Grouping

The column will be sorted and grouped based on the text that is provided for display in the button.

### Placeholder

The column cell will not have a placeholder. If an empty, `undefined`, or `null` value is provided for the record, an empty cell will be rendered.

Group rows will display `tableGroupRowPlaceholderNoValueLabel` when the value is `undefined` or `null` and `tableGroupRowPlaceholderEmptyLabel` when the value is an empty string. This group row placeholder behavior already exists in the `TableColumnTextGroupHeaderView`, so no changes are required to achieve this behavior.

### Delegated Events

The cell will delegate the `beforetoggle` and `toggle` events from the menu button through the table's `delegate-event` event. This will allow a client application to listen for the delegated event and update the menu items in the slotted menu as appropriate before the menu opens.

### Focus Recycling

Because the menu button in the cell can have focus, we must override `focusedRecycleCallback()` in our cell view and have it call `blur()` on the button. If we don't, the focus can pass to other cells as you scroll.

### Sizing

The column will support fractional width sizing along with a minimum pixel width.

### Interactions

When the menu button is focused, it will have the same keyboard interactions as the `nimble-menu-button` outside of a table. Interacting with the menu button and its slotted menu, whether via keyboard or mouse, will not modify the selection in the table.

### Accessibility

-   If the text of the button does not fit fully in the button, it will be ellipsized and the button's `title` will be set to the full text.

### Angular integration

An Angular wrapper will be created for the component. There is no special considerations for Angular.

### Blazor integration

A Blazor wrapper will be created for the component. There is no special considerations needed for Blazor.

### API Updates to Existing Table Components

Multiple API changes need to be made the table, its subcomponents, and the classes it uses to facilitate slotting a menu through the table and into a specific cell view.

These changes include changes to the following:

-   The `ColumnInternalsOptions` interface will be updated to include an optional string array named `slotNames`, which allows a column to specify the names of any slots that need to be forwarded into a cell.
-   As with the `ColumnInternalsOptions`, the `ColumnInternals` class will be updated to have a `slotNames` array that specifies the names of any slots that need to be forwarded into a cell. The value will be readonly and will be populated by the `ColumnInternalsOptions` `slotNames` property. It will default to an empty array if a value is not provided in `ColumnInternalsOptions`.
-   The `createCellViewTemplate` function exported from the base `cell-view` template will be updated to `repeat` over all slot names specified in the column's `slotNames` array and create a `slot` for each. The `name` of each slot will be the value in the `slotNames` array concatenated to the column's unique ID (i.e. `column.columnInternals.uniqueId + column.columnInternals.slotNames[i]`). The `slot` attribute will be set to the value in the `slotNames` array.
-   Add events to pass slot information between cell views, rows, and the table. These will look as follows:
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

## Alternative Implementations / Designs

_Alternative #1_

Rather than creating a menu button column, we could create a select column. However this has a number of challenges steming from the fact that the `nimble-select` has a different slotting model than the `nimble-menu-button`. As a result, it would be very difficult have an API that allows providing unique options for each record without a significant redesign of the select. Additionally, the `nimble-select` has interactions that allow the value to be changed without the component being open. This poses a challenge of handling all the cases where a given select's options need to be updated.

## Open Issues

-   In the Software Table, how should the currently installed version be represented? Currently it is italicized in both the menu and menu-button, but this is probably not the solution we want in the nimble table column.
-   In the Software Table, the full software version is displayed as the title of the menu button and menu items. Where should that information go?
-   There is no visual design spec for this feature yet. Therefore there are a few open visual design questions, including the following:
    -   If we only support one appearance for the menu-button, is `ghost` the appropriate one to support?
    -   Is there any concern that the button text will not align with the column header because of the padding between the edge of the button and the text within the button?
