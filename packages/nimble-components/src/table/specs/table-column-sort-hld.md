# Table Column Sorting HLD

## Problem Statement

There is a requirement to have table columns that can be sorted, both programmatically and interactively. This document focuses specifically on programmatic sorting of columns.

### Out of scope of this HLD

While some interactive sorting may be alluded to within this document, the details of interactive sorting are out of scope for this document. For example, this document does not cover:

-   How a column will opt in/out of being interactively sortable
-   Event(s) related to sorting
-   Interactions that lead to the sorting state changing, e.g. clicking a header, option(s) in the header's menu

## Links To Relevant Work Items and Reference Material

-   [#874 Programmatically sort columns](https://github.com/ni/nimble/issues/874)
-   [#854 Interactively sort the columns in a table](https://github.com/ni/nimble/issues/854)
-   [Table README](./README.md)
-   [Table Design Doc](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/)

## Implementation / Design

### API

The sorting state of the table will be declaritively defined within the `TableColumn` elements that are slotted within the table. A column will optionally be able to define its sort direction (i.e. `ascending` vs `descending`) and its sort index. The sort index enables a table to be sorted by multiple columns at the same time. For example, if a table should be sorted by a first name column and then a last name column, the first name column would have a sort index of 0, and the last name column would have a sort index of 1. This is a similar API to AG Grid, which provides [sort](https://www.ag-grid.com/javascript-data-grid/column-state/#reference-ColumnStateParams-sort) and [sortIndex](https://www.ag-grid.com/javascript-data-grid/column-state/#reference-ColumnStateParams-sortIndex) configurations.

In some cases, a client may want to configure their table to be sorted by a column that is not visible within the table. To enable this, a column within the table can be marked as hidden. A hidden column exists in the table to provide metadata that can be used for operations, such as sorting, but it is not rendered within the table.

A column within the table may not have a one-to-one mapping to a field within the table's data. For example, a hyperlink column might use two fields from the data: a string to use as the hyperlink's display and a string to use as the hyperlink's href. Because of this, a column must define which data field is used when sorting that column. That field is specified by a column definition by implementing an `operationalDataFieldName` getter that returns the name of the field to use for sorting. For example, the text column would return the value of `fieldName` and the hyperlink column would return the field name associated with the display string.

For performance reasons, the table will not support custom sort functions on a column. A column can only be sorted based on a single field within the table's data, which guards against performance degradations from inefficient custom sort functions.

#### Summary of new attributes on the base table column

| attribute name | type                                                                                                         | default value                   | description                                                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| sort-direction | `TableColumnSortDirection`, defined as `{none: undefined, ascending: 'ascending', descending: 'descending'}` | `TableColumnSortDirection.none` | The direction the column is sorted                                                                                          |
| sort-index     | `number` or `null` \*                                                                                        | `null`                          | The index for sorting the column. When multiple columns are sorted, they will be sorted from lowest index to highest index. |
| hidden         | `boolean`                                                                                                    | `false`                         | When set to true, do not render the column as part of the table                                                             |

\* Note: The `sort-index` attribute is `number | null` because of the plan to use the `nullableNumberConverter` provided by FAST. That converter uses the value of `null` to represent non-number types rather than `undefined`, which is common within the nimble repo.

### Validation

The table will be invalid if it contains two columns with the same `sort-index`. If a duplicate `sort-index` is detected, the rows in the table will not render, no sort indicators will render, and the table's validity object will have `duplicateColumnSortIndex` set to `true`.

### Visualizing the sort state

Each column that is sorted will have an appropriate icon displayed in the header as shown in the design spec.

### Accessibility

Each column that is sorted ascending will have `aria-sort="ascending"` set on the header, and each column that is sorted descending will have `aria-sort="descending"` set on the header.

## Alternative Implementations / Designs

### Add additional restrictions for validation

The table could enforce additional restrictions on the sort settings of the columns, for example:

-   All sorted columns must have sequencial sort orders starting at 0
-   No column can have a `sort-index` specified if its `sort-direction` is `none`
-   No column can have its `sort-direction` specified as `ascending` or `descending` without a `sort-index` specified
-   No two columns can specify the same field name to use for sorting

The purpose of the table's validation is to ensure that a user/client does not get into an inconsistent or non-deterministic state. For example, having two records with the same ID causes indeterministic event behavior. However, all of the cases listed above have well defined behavior associated with them, so there is no reason to add additional overhead and restrictions to the table to disallow those cases.

### Provide a way for clients to override the sort field

The base table column could provide a way for a client to override the sort field for a column. For example, the base column class could expose an attribute that overrides the value returned by the `operationalDataFieldName` getter. It isn't clear at this point in time whether or not this is required on all column types, or even any column types. As a result, the attribute will not be added at this time. In the future, when there is more insight into the requirements, the attribute can either be added to the base class or a mixin can be created to provide a consistent way to allow some column types to expose the configuration in a consistent way.

## Open Issues

_None_
