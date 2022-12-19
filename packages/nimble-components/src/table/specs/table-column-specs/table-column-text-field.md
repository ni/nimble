# TableColumnTextField

## Overview

The `nimble-table-column-text-field` is a component that defines how to render a cell for that column in a `nimble-table` as text.

### Background

[Table Column API](../table-columns-hld.md)

[Table Spec](../README.md)

[Visual Design Spec](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/specs/)

### Non-goals

- Defining an API that supports editable text. Once we need editable text we will determine if it makes sense to modify this component or introduce a new column type.
  
### Features

- Offers a `placeholder` attribute that allows a user to define what text to render when no value is provided by the `nimble-table` data.

---

## Design

Below is an example of how the `nimble-table-column-text-field` would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-text-field value-key="firstName" placeholder="No data"></nimble-table-column-text-field>
    <nimble-table-column-text-field value-key="lastName" placeholder="No data"></nimble-table-column-text-field>
</nimble-table>
```

### API
_Component Name_
- `nimble-table-column-text-field`

_*Props/Attrs*_
- `value-key`: string
- `placeholder`: string

_Type Reference_
- [`TableColumn`](../table-columns-hld.md#tablecolumn)
- [`StringField`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table/specs/table-data-api.md#implementation--design) (section showing example types)
- [`TableCellState`](../table-columns-hld.md#tablecellstate-interface)

The `TableColumnTextField` will extend the `TableColumn` in a manner similar to the following:

```TS
type TableColumnTextCellData = StringField<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

public class TableColumnTextField extends TableColumn<TableColumnTextCellData, TableColumnTextColumnConfig> {
    ...

    @attr({ attribute: 'value-key'})
    public valueKey: string;

    @attr
    public placeholder: string; // Column auxiliary configuration

    public getRowDataKeys(): string[] {
        return [valueKey];
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

The visual appearance of the text content will match that of a `nimble-text-field`.

---

## Implementation

For the `cellTemplate` implementation required for a `TableColumn<>` implementation we will provide something similar to the following:

```TS
public class TableColumnTextField ...
{
    ...

    public cellDataKeyNames = ['value'] as const;

    public readonly cellStyles: ElementStyles => css`
        .text-value {
            // set necessary text-value styles
        }

        .placeholder {
            // set necessary placeholder styles
        }
    `;

    public readonly cellTemplate: ViewTemplate<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>> => 
        html<TableCellState<TableColumnTextCellData, TableColumnTextColumnConfig>>`
            ${when(x => x.data.value, html`
                <span class="text-value">{x => x.data.value}</span>
            `)}
            ${when(x => !x.data.value, html`
                <span class="placeholder">{x => x.columnConfig.placeholder}</span>
            `)}
        `;
    
    ...
}
```
### Alternatives considered

We are using `span` elements for the text rendering of the values instead of a `nimble-text-field` for performance's sake, as we avoid the notably heavier cost of using a custom element. The other benefits that using a `nimble-text-field` offer, such as built-in styling and a placeholder implementation seem trivial to replicate, which seems worth it for a performance improvement.

One notable difference in behavior is that the proposed implementation will not support a behavior present in the `nimble-text-field` where a user can begin dragging at an arbitrary location in the text, and go to the end of the text, even if it has been clipped by the column (and thus showing an `...`). Users will still be able to double-click such text and copy the entire contents.

### States

N/A

### Accessibility

Accessibility of the cells rendered using the `nimble-table-column-text-field` are handled via the [`nimble-table-cell`](https://github.com/ni/nimble/blob/f663c38741e731bef91aa58e8fb2d1cec653b679/packages/nimble-components/src/table/components/cell/template.ts#L6) which has a `role` of [`cell`](https://w3c.github.io/aria/#cell).

### Globalization

None

### Security

None

### Performance

As discussed in the implementation section we are making a deliberate choice to not use the `nimble-text-field` to provide the best initialization performance possible.

### Dependencies

None.

### Test Plan

Unit tests will be written to test the component.

### Tooling

None.

### Documentation

This component will be documented via its usage in the storybook for the `nimble-table`.

---
## Open Issues

*Highlight any open questions for discussion during the spec PR. Before the spec is approved these should typically be resolved with the answers being incorporated in the spec document.*