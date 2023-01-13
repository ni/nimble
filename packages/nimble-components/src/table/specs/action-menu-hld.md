# Nimble Table Action Menu API

## Problem Statement

In some tables, such as many tables within SLE, there is a need to put a menu button within a row of the table. The `nimble-table` should provide a way for clients to accomplish this to avoid code duplication and promote consistency.

### Out of scope of this HLD

-   The interaction of the menu opening and closing in coordination with row selection is out of scope for this HLD. This interaction will be discussed when row selection is defined.

## Links To Relevant Work Items and Reference Material

[Table Spec](./README.md)

Example action menu in SLE
![SLE action menu](./spec-images/sleActionMenu.png)

## Implementation / Design

### Client-facing API

There are two pieces of configuration that must be provided by a client in order to use the action menu:

1. Specifying which column, or columns, the action menu will be visible within
2. Specifying the menu and its items to show when the menu button is open

The nimble design system will be opinionated about many details of the menu button within a table. Therefore, a client will not be able to configure the exact details of the menu button itself, such as:

-   The appearance mode of the button
-   The icon shown within the button
-   When the button becomes visible (e.g. always visible, visible on hover/selection only, etc.)

If the need arises for a client to have more control of the menu button's configuration, the API can be extended at a later time.

#### Specifying a column to include a menu button

A client can specify that a column should have an action menu within it by adding the `show-menu` attribute on the column definition. In the example below, the menu will be added to the _First name_ column only. The `show-menu` attribute can be added to multiple columns if multiple action menus are desired within a row.

```HTML
<nimble-table>
    <nimble-table-column-text field-name="firstName" show-menu>First name</nimble-table-column-text>
    <nimble-table-column-text field-name="lastName">Last name</nimble-table-column-text>
</nimble-table>
```

### Providing a menu

Because only one menu can be open on the page at a time, the client can provide a single menu that will be associated with the correct menu button when it is open. The menu is provided by the client by slotting a menu in the `action-menu` slot as shown below:

```HTML
<nimble-table>
    <nimble-table-column-text field-name="firstName" show-menu>First name</nimble-table-column-text>
    <nimble-table-column-text field-name="lastName">Last name</nimble-table-column-text>

    <nimble-menu slot="action-menu">
        <nimble-menu-item>My first action</nimble-menu-item>
        <nimble-menu-item>My second action</nimble-menu-item>
        <nimble-menu-item>My last action</nimble-menu-item>
    </nimble-menu>
</nimble-table>
```

If an application requires different menu items for different rows, the client is responsible for ensuring that the items in the menu are correct for the row(s) that the menu is associated. This can be done by handling the `action-menu-opening` event on the table and updating the menu items as appropriate. The `action-menu-opening` event will include the following in its details:

-   `rowIds` - string array - The IDs of the rows that the menu is associated with.
-   `columnId` - string, possibly undefined - The ID of the column that the menu is associated with. A column ID is optional on a column definition. If the menu is associated with a column without an ID, `columnId` will be `undefined` in the event details.

### Implementation

#### Slot Forwarding

In order for the menu slotted within the table to be slotted within a cell's `nimble-menu-button`, the menu needs to be "forwarded" from the table to a row and then to a cell. Every row will have a slot for a menu, but only the row with the open menu will have something slotted within it. Similarly, every cell in a column with a menu will have a slot for a menu, but only the cell with an open menu will have something slotted within it. Events will be used to know when the row and cell the menu is associated with needs to change, and the templates will dynamically rename their slots to ensure the menu is slotted in the correct elements.

For example, the table's template will look something like this:

```HTML
<template>
    ...
    <nimble-table-row>
        <slot slot="row-action-menu" name="${(x, c) => ((c.parent.openActionMenuRowId === x.id) ? 'action-menu' : 'unused-action-menu')}"></slot>
    </nimble-table-row>
    ...
</template>
```

#### Updates to `nimble-menu-button`

To implement the design described above, a few small changes need to be made to the existing `nimble-menu-button`:

-   Add an `opening` event that gets fired immediately before the menu is opened. This new event will allow the table to slot the menu into the correct row and cell prior to the menu actually opening. This is important to ensure that the menu items can be focused correctly upon the menu opening.
-   Update the code that gets the slotted menu. Currently, the code only looks for the first element in the `menu` slot. With the design above, the menu element will be nested within a few `slot` elements, so the code will be updated to handle both DOM structures.

### Framework Integration

There is no framework-specific integration work necessary with this design. One large benefit of the approach to slot a menu within the table is that applications written using frameworks can use framework-specific mechanisms to build the menu/menu-items and handle events associated with the menu.

## Alternative Implementations / Designs

### Provide column IDs to the table to specify columns with menus

Rather than configuring a column to have a menu by adding an attribute to the column definition, a column could be configured to have a menu by adding a property to the table that is the array of column IDs that should have a menu. This is not ideal for a few different reasons:

-   It requires columns to have IDs when this may not otherwise be necessary.
-   It is more error prone because mistakes could be made keeping the configuration of column IDs in sync between the column definitions and table configuration.

## Open Issues

-   Can the action menu be opened for multiple rows at the same time? This doesn't become possible until the table supports row selection, but it can impact the API. To be the most future-proof, the API is designed such that the `action-menu-opening` event includes an array of row IDs rather than a single row ID string.
-   The details of the visual/interaction design still need to be finalized by the designers, but these details should have minimal impact on the implementation. Some items that need to be finalized are:
    -   What icon will be used for the menu? Will it still be the three dots in a horizontal line?
    -   What is the exact interaction with the menu being visible on hover?
    -   Is the space of the menu-button always reserved within a column, or does the space collapse when the button is hidden?
    -   How does the menu interact with row selection? This is a future-looking question because the table does not currently support selection.
