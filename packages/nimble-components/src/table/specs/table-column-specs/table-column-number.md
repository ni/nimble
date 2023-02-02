# TableColumnNumber

## Overview

The `nimble-table-column-number` is a component that defines how to render a number in a cell for that column in a `nimble-table` as text.

One key advantage of the number column beyond the existing `nimble-table-column-text` is that it will ensure data in the column is sorted numerically rather than alphabetically. TODO: true?

### Background

[Number column work item](https://github.com/ni/nimble/issues/1011)

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Table Column Text Spec](./table-column-text-field.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

-   Editable numbers. This is not supported by the text column yet either.
-   Customizing the styling or alignment of the column content. This is not supported by the text column yet either.
-   API to include units with the number (e.g. "10 miles"). While it would be easy to append a client-configurable unit string after the number (and we may decide to do so eventually), the existing use cases we've found would require custom logic for each unit that doesn't belong in a generic column type. For example, formatting 76 seconds of elapsed time as "1m 16s" or formatting 1024 bytes of file size as "1 KB". These could be provided by Nimble or by clients as their own dedicated column types.
-   API to configure numeric formatting. While clients may eventually wish to choose to display values with, for example, a specific number of decimal digits or a customizable thousands separator, the concrete use cases we have initially can be handled with a default formatting behavior (described below).

### Features

-   Offers a `placeholder` attribute that allows a user to define what text to render when no value is provided by the `nimble-table` data.

---

## Design

Below is an example of how the `nimble-table-column-number` would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-number field-name="recordCount" placeholder="">Count</nimble-table-column-number>
    <nimble-table-column-number field-name="tagValue" placeholder="No value">Tag Value</nimble-table-column-number>
</nimble-table>
```

### API

_Component Name_

-   `nimble-table-column-number`

_*Props/Attrs*_

-   `field-name`: string
-   `placeholder`: string

_Type Reference_

-   [`TableColumn`](../table-columns-hld.md#tablecolumn)
-   [`TableStringField`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table/specs/table-data-api.md#implementation--design) (section showing example types)
-   [`TableCellState`](../table-columns-hld.md#tablecellstate-interface)

The `TableColumnText` will extend the `TableColumn` in a manner similar to the following:

```TS
type TableColumnTextCellRecord = TableStringField<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

public class TableColumnText extends TableColumn<TableColumnTextCellRecord, TableColumnTextColumnConfig> {
    ...

    @attr({ attribute: 'field-name'})
    public fieldName: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public cellRecordFieldNames = ['value'] as const;

    public getDataRecordFieldNames(): string[] {
        return [fieldName];
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

For the `cellTemplate` implementation required for a `TableColumn<>` implementation we will provide something similar to the following:

```TS
public class TableColumnText ...
{
    ...

    public readonly cellStyles = css`
        .text-value {
            // set necessary text-value styles
        }

        .placeholder {
            // set necessary placeholder styles
        }
    `;

    public readonly cellTemplate = html<TableCellState<TableColumnTextCellRecord, TableColumnTextColumnConfig>>`
            <span class="${x => x.data.value ? 'text-value' : 'placeholder'}">
                ${x => x.data.value? x.data.value : x.columnConfig.plaeholder}
            </span>
        `;

    ...
}
```

Note that as we are using a `span` element for the visual we will not support many of the features native to the `nimble-text-field` component as they have little value. This includes:

-   No alternate appearance modes (always frameless)
-   No support for disabled state
-   No support for error states
-   No password display support

### Alternatives considered

We are using `span` elements for the text rendering of the values instead of a `nimble-text-field` for performance's sake, as we avoid the presumably heavier cost of using a custom element. The other benefits that using a `nimble-text-field` offer, such as built-in styling and a placeholder implementation seem trivial to replicate, which seems worth it for a performance improvement.

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

-   Unit tests will be written to test the component.
    -   Test for cases where rendered value is HTML content (i.e. `"<button>Should not be a button</button>"`)
    -   Test for case where rendered value is a non-standard charater (e.g. emoji, Asian character, etc...)
-   Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
-   Have a Chromatic test in place for this column

### Tooling

None.

### Documentation

This component will be documented via its usage in the storybook for the `nimble-table`.

---

## Open Issues

-   Are there specific configurarable styling requirements we need for both the rendered data value and the placeholder (e.g. italics for placeholder)
