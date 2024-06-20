# Custom table column sort order HLD

## Problem Statement

In some cases, a client may have the need to specify a custom sort order for a column. For example, a table displaying SystemLink tags may have a field in their data for stringified tags but may not want to sort that column that stringified value. Instead, they want to provide their own sort order that takes the tag's data type and value into account.

## Links to Relevant Work Items and Reference Material

[Azdo Feature 2665131 - Custom column sorting](https://dev.azure.com/ni/DevCentral/_workitems/edit/2665131)

## Implementation / Design

Columns that need support for a custom column sort order will extend their API to allow a client to optionally specify an additional field name within the data that the data will be sorted by when the column is sorted. This field is expected to be a numeric value that is the sorted data index of the record. As a result, when sorting by this field, the table will use the `basic` sort operation.

TanStack uses the same field internally for both sorting and grouping. Grouping by this custom sort field could likely lead to unexpected results since. Therefore, grouping and specifying a custom sort order will not be allowed on a column at the same time. If both are specified at the same time, the column will be considered invalid and the `invalidCustomSortWithGrouping` validation error will be added to the column.

Columns will add custom sort orders on an as-needed basis. There are no changes required to the core table code. Only column APIs will need to be updated to:

-   Include a `sort-by-field-name` string attribute
-   Update column internals when `sort-by-field-name` is defined to
    1. Set the `operandDataRecordFieldName` to `sort-by-field-name`
    1. Set the `sortOperation` to `basic`
-   Validate that `sort-by-field-name` is not set at the same time as `group-index`

Most of the column changes will be the same for all columns needing this functionality. Therefore, as much logic as possible will be added to a new mixin named `mixinCustomSortOrderColumnAPI`.

Initially, this functionality will be added only to `nimble-table-column-text` and `nimble-table-column-anchor` because those are the only columns known to need this functionality.

## Open Issues

_None_