# TableColumnText

## Overview

The `nimble-table-column-text` is a component that defines how to render a cell for that column in a `nimble-table` as text.

### Background

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

- Defining an API that supports editable text. Once we need editable text we will determine if it makes sense to modify this component or introduce a new column type.
- Provide API to customize styling of the column content. Styles will be defined statically in the implementation via the cell view element.

### Features

---

## Design

Below is an example of how the `nimble-table-column-text` would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-text field-name="firstName">First Name</nimble-table-column-text-field>
    <nimble-table-column-text field-name="lastName">Last Name</nimble-table-column-text-field>
</nimble-table>
```

### API

_Component Name_

- `nimble-table-column-text`

_*Props/Attrs*_

- `field-name`: string

_Type Reference_

- [`TableColumn`](../table-columns-hld.md#tablecolumn)
- [`TableStringField`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table/specs/table-data-api.md#implementation--design) (section showing example types)
- [`TableCellState`](../table-columns-hld.md#tablecellstate-interface)

The `TableColumnText` will extend the `TableColumn` in a manner similar to the following:

```TS
type TableColumnTextCellRecord = TableStringField<'value'>;
type TableColumnTextColumnConfig = {};

public class TableColumnText extends TableColumn<TableColumnTextCellRecord, TableColumnTextColumnConfig> {
    ...

    @attr({ attribute: 'field-name'})
    public fieldName: string;

    protected fieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.fieldName] as const;
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            ...
        };
    }
    ...
}
```

### Anatomy

As this component has no template, there is no anatomy of concern.

### Angular integration

An Angular directive will be created for the component. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component.

### Visual Appearance

The visual appearance of the text content will match that of a frameless `nimble-text-field`.

---

## Implementation

The cell view element will have styles and and template similar to:

```TS
const styles = css`
    .text-value {
        // set necessary text-value styles
    }
`;

const template = html<TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>>`
    <span class="${x => x.data.value ? 'text-value' : undefined}">
        ${x => x.data.value? x.data.value : x.columnConfig.plaeholder}
    </span>
`;

```

Note that as we are using a `span` element for the visual we will not support many of the features native to the `nimble-text-field` component as they have little value. This includes:

- No alternate appearance modes (always frameless)
- No support for disabled state
- No support for error states
- No password display support

## Sorting behavior

The column will be sortable, and by default, the sorting will occur in a locale-aware way on the string value associated with `field-name`.

The column will also support having a custom sort order, as detailed in the [Custom Sort Order HLD](../table-column-custom-sort-field-hld.md).

### Alternatives considered

We are using `span` elements for the text rendering of the values instead of a `nimble-text-field` for performance's sake, as we avoid the presumably heavier cost of using a custom element. The other benefits that using a `nimble-text-field` offer, such as built-in styling, seems trivial to replicate, which seems worth it for a performance improvement.

One notable difference in behavior is that the proposed implementation will not support a behavior present in the `nimble-text-field` where a user can begin dragging at an arbitrary location in the text, and go to the end of the text, even if it has been clipped by the column (and thus showing an `...`). Users will still be able to double-click such text and copy the entire contents.

### States

N/A

### Accessibility

Accessibility of the cells rendered using the `nimble-table-column-text` are handled via the [`nimble-table-cell`](https://github.com/ni/nimble/blob/f663c38741e731bef91aa58e8fb2d1cec653b679/packages/nimble-components/src/table/components/cell/template.ts#L6) which has a `role` of [`cell`](https://w3c.github.io/aria/#cell).

### Globalization

None

### Security

Ensure no script/HTML injection can occur.

### Performance

As discussed in the implementation section we are making a deliberate choice to not use the `nimble-text-field` to provide the best initialization performance possible.

### Dependencies

None.

### Test Plan

- Unit tests will be written to test the component.
    - Test for cases where rendered value is HTML content (i.e. `"<button>Should not be a button</button>"`)
    - Test for case where rendered value is a non-standard charater (e.g. emoji, Asian character, etc...)
- Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
- Have a Chromatic test in place for this column

### Tooling

None.

### Documentation

This component will be documented via its usage in the storybook for the `nimble-table`.

---

## Open Issues
