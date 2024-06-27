# Custom table column sort order HLD

## Problem Statement

In some cases, a client may have the need to specify a custom sort order for a column. For example, a table displaying SystemLink tags may have a field in their records for the stringified tag but may not want to sort that column by that stringified value. Instead, they want to provide their own sort order for tags that takes each tag's data type and value into account.

## Links to Relevant Work Items and Reference Material

[Azdo Feature 2665131 - Custom column sorting](https://dev.azure.com/ni/DevCentral/_workitems/edit/2665131)

## Implementation / Design

Columns that need support for a custom column sort order will extend their API to allow a client to optionally specify an additional field within the data that specifies the sort order of that column. This field is expected to be a numeric value where the order of the values indicates the order in which the records should be sorted, such as the sorted data index of the record. When the table is sorted by this column, the table will use the `basic` sort operation and sort the records by the additionally specified field rather than the default `operandDataRecordFieldName` associated with the column.

TanStack uses the same field internally for both sorting and grouping. Grouping by this custom sort field could likely lead to unexpected results since there isn't a guarantee that two values that render identically have the same sort index. Therefore, grouping and specifying a custom sort order will not be allowed on a column at the same time. If both are specified at the same time, the column will be considered invalid and the `invalidCustomSortWithGrouping` validation flag will be set on the column.

Columns will add custom sort orders on an as-needed basis. There are no changes required to the core table code. Only column APIs will need to be updated to:

-   Include a `sort-by-field-name` string attribute
-   Update column internals when `sort-by-field-name` is defined to
    1. Set the `operandDataRecordFieldName` to the value of `sort-by-field-name`
    1. Set the `sortOperation` to `basic`
-   Validate that `sort-by-field-name` is not set at the same time as `group-index`

Most of the column changes will be the same for all columns needing this functionality. Therefore, as much logic as possible will be added to a new mixin named `mixinCustomSortOrderColumnAPI`.

Initially, this functionality will be added only to `nimble-table-column-text` and `nimble-table-column-anchor` because those are the only columns known to need this functionality.

## Alternative Implementations / Designs

### Support grouping and custom sort order together

If a column with a custom sort order needs to be groupable, that could likely be achieved through a more complex implementation. The changes to implement this include:

-   Add additional field to `ColumnInternals`, say `sortDataRecordFieldName`, to track the sort data field separate than the `operandDataRecordFieldName` that is used for grouping
-   Table columns will set `sortDataRecordFieldName` to the value of `sort-by-field-name` rather than updating `operandDataRecordFieldName`.
-   When `sortDataRecordFieldName` is set on a column, the `nimble-table` will create two TanStack columns for that nimble column. One column will be associated with the `operandDataRecordFieldName` and the other will be associated with `sortDataRecordFieldName`. The `nimble-table` would have logic to know which TanStack column to mark as grouped or sorted when the nimble column was grouped or sorted.
-   Update the table's update tracker to have the correct notification logic to regenerate the TanStack columns, grouping state, and sorting state at the appropriate times.

**Pros:**

-   Removes the limitation of not being able to group a column with a custom sort order. This includes not needing to add validation for this scenario.

**Cons:**

-   Adds additional complexity to the table.
-   It is unclear whether or not this is actually helpful in practice. It can lead to items being sorted drastically differently but being grouped together. For example, a number tag with the value of `0` and the string tag with the value of `"0"` would likely be sorted in different positions, but they would both have the same string representation of `"0"`.

With the exception of adding the `invalidCustomSortWithGrouping` key in the columns' validation objects, all the changes proposed in this HLD are backwards compatible from an end-client point of view with this alternative. Therefore, since no clients currently need grouping with custom sorting and since it isn't clear if this would ever be desirable, it makes the most sense to implement the more straightfoward behavior and not support grouping a column that has custom sorting is enabled.

### Allow specifying custom sort function

Rather than having a client pre-sort their data and specify a `sort-by-field-name` on the column, the client could specify a custom sort function for the column. This however, would be difficult to achieve in Blazor since it would require custom JS code that is configured for a column. Additionally, it opens the door for a client to significantly impact the sort performance on the table by writing a slow sort function that gets called every time a user clicks on the column's header. This approach would also be inconsistent with other decisions made for the column, such as the decision not to allow custom format functions to be specified for text or number columns.

## Open Issues

_None_
