# Table Column Sorting HLD

## Problem Statement

*Brief description of the reason for this work and an executive summary of the proposed design.*

### Out of scope of this HLD

While some interactive sorting may be alluded to within this document, solidifying the details of interactive sorting is out of scope for this document. For example, this document does not cover:
    - How a column will opt in/out of being interactively sortable
    - Event(s) that are emitted related to sorting
    - Interactions that lead to the sorting state changing (e.g. clicking a header, option(s) in the header's menu)

## Links To Relevant Work Items and Reference Material

-   [#874 Programmatically sort columns](https://github.com/ni/nimble/issues/874)
-   [#854 Interactively sort the columns in a table](https://github.com/ni/nimble/issues/854)
-   [Table README](./README.md)
-   [Table Design Doc](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/)

## Implementation / Design

### API

The sorting state of the table will be declaritively defined within the `TableColumn` elements that are provided within the table. A column will optionally be able to define its sort direction (i.e. `ascending` vs `descending`) and its sort index. The sort index enables a table to be sorted by multiple columns at the same time. For example, if you wanted to sort by a first name column and then a last name column, the first name column would have a sort index of 0, and the last name column would have a sort index of 1. This is a similar API to AG Grid, which provides [sort](https://www.ag-grid.com/javascript-data-grid/column-state/#reference-ColumnStateParams-sort) and [sortIndex](https://www.ag-grid.com/javascript-data-grid/column-state/#reference-ColumnStateParams-sortIndex) configurations.

In some cases, a client may want to configure their table to be sorted by a column that is not visible within the table. To enable this, a column within the table can be marked as hidden. A hidden column exists in the table to provide metadata that can be used for operations, such as sorting, but it is not rendered within the table.

A column within the table may not have a one-to-one mapping to a field within the table's data. For example, a hyperlink column might use two fields from the data: a string to use as the hyperlink's display and a string to use as the hyperlink's href. Because of this, a column must define which data field is used when sorting that column. The primary way the field will be specified is by a given column type implementing a `defaultDataFieldName` getter that returns the name of the field that column thinks should be used for sorting. For example, the text column would return the value of `fieldName` and the hyperlink column would return the field name associated with the display string. If, however, a client wants to associate the sorting behavior with a different field in their data, they can modify the behavior by setting the `data-field-name` attribute on the column.

For performance reasons, the table will not support custom sort functions on a column. A column can only be sorted based on a single field within the table's data, which guards against performance degradations from inefficient custom sort functions.

#### Summary of new attributes on the base table column
| attribute name | type | default value | description |
| -- | -- | -- | -- |
| sort-direction | `TableColumnSortDirection`, defined as `{none: undefined, ascending: 'ascending', descending: 'descending'}` | `TableColumnSortDirection.none` | The direction the column is sorted |
| sort-index | `number` or `null` * | `TableColumnSortDirection.none` | The direction the column is sorted |
| hidden | `boolean` | `false` | When set to true, do not render the column as part of the table |
| data-field-name | `string` or `undefined` | `undefined` | Set by a client to override the default sorting behavior of a column. When set, the data field specified by this attribute will be used when sorting the column. |

\* Note: The `sort-index` attribute is `number | null` because of the plan to use the `nullableNumberConverter` provided by FAST. That converter uses the value of `null` to represent non-number types rather than `undefined`, which is common within the nimble repo.

### Validation

The table will be invalid if it contains two columns with the same `sort-index`. If a duplicate `sort-index` is detected, the rows in the table will not render, no sort indicators will render, and the table's validity object will have `duplicateColumnSortIndex` set to `true`.

TODO: What about duplicate sort fields?

### Visualizing the sort state

### Accessibility

Each column 

*Describe the implementation and what systems will be affected. Items to consider include:*
   - *Does the design follow an existing design in this codebase or FAST?*
   - *Does the design align with web standards like web components, ARIA, etc?*
   - *Does the design create new requirements on clients or break any APIs?*
   - *How does the design affect testing, documentation, performance, security, etc?*

*It may be useful to review the sections of the custom component spec template to remind you of other items to consider.*

## Alternative Implementations / Designs

*Describe any design alternatives and discuss why they were rejected.*

## Open Issues

-   Should we validate against multiple columns having the same data field?
    -   TODO: Verify whether or not this would cause issues within TanStack. If it causes problems, that probably makes our decision easy.
-   Are the sort icons shown on all sorted columns or just the column with sort order === 0?