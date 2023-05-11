# Table Column Interaction Events HLD

## Problem Statement

Some clients need to know when a user interactively changes the configuration of their table columns. This includes:
-   Sorting a column
-   Grouping by a column
-   Resizing a column

### Out of scope of this HLD

There are some interactions on the table that will not be covered by this HLD. The rationale for that decision is that they are not interactions that affect a column state. These include:

-   Expanding/collapsing a group
-   Modifying row selection; row selection can already be observed by a client using the `selection-change` event on the table

## Implementation / Design

### API

In order to keep clients from having to listen for a number of different events when they will likely respond in a similar way to any part of the column configuration changing, there will be a single `column-configuration-change` event that fires when a user interactively sorts a column, groups by a column, or resizes a column. The details of the event will include the current column configuration and look as follows.

```ts
/**
 * Event detail type for interactive column configuration changes.
 */
export interface TableColumnConfigurationChangeEventDetail {
    columns: TableColumnConfiguration[];
}

/**
 * Information about the current configuration of a single column 
 */
export interface TableColumnConfiguration {
    columnId?: string;
    sortIndex?: number | null;
    sortDirection: TableColumnSortDirection;
    groupIndex?: number | null;
    hidden: boolean;
    fractionalWidth: number;
    pixelWidth?: number | null;
}
```

Columns will be included in the `columns` array in the same order they are specified in the DOM. Information included in the `TableColumnConfiguration` object will be specified by the "current" values when available (e.g. `currentSortIndex`, `currentSortDirection`). When an attribute does not have a "current" value, then the non-current value will be specified (e.g. `columnId`, `groupIndex`).

## Future Work

### Cancellable events

It is possible that the requirement will come up in the future to have cancellable events. For example, allow the client to cancel an interactive sort because the application should request a new set of data from the server before sorting the data loaded in the `nimble-table`. This requirement is out of scope for this HLD, and there are no plans to make the `column-configuration-change` event cancellable. Instead, we could have specific events that are cancellable (such as `column-sort-change`), and cancelling that event would prevent the sort operation from occuring and `column-configuration-change` from being emitted.


### Programmatic get/set column configuration

In the future we could add functions for getting and setting the column configuration on the table. There currently isn't a requirement for these functions, so they will not be added at this time.

### Expanding information included in event details

The need may arise in the future to have more information included in the event details. For example, the table might have a setting the minimum total width of all columns. When/if that is the case, `TableColumnConfigurationChangeEventDetail` can be updated to include that information.