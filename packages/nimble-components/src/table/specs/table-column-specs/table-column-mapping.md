# Mapping Table Column

## Overview

The `nimble-table-column-mapping` is a component that supports rendering specific number, boolean, or string values as mapped, predefined, html fragments (with content restrictions).

### Background

[Icon column type issue](https://github.com/ni/nimble/issues/1013)

[Boolean column type issue](https://github.com/ni/nimble/issues/1103)

### Features

-   Supported input:
    -   string
    -   number
    -   boolean
-   Supported output:
    -   Text
    -   One or more Nimble icons (with colors via icon severity property)
    -   Nimble spinner
    -   Mixed icons and text
    -   (empty)

### Non-goals

-   Non-Nimble icon support
-   Arbitrary icon colors
-   Hyperlink icons
-   Non-icon, non-spinner Nimble components
-   Arbitrary html

---

## Design

In addition to the `nimble-table-column-mapping` element, there are `nimble-mapping-<input type>` elements to define mappings between values and html fragments. Below is an example of how these elements would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-mapping field-name="status">
        Status
        <nimble-mapping-string key="fail">
            <template>
                <nimble-icon-xmark severity="error" title="Failed"></nimble-icon-xmark>
            </template>
        </nimble-mapping-string>
        <nimble-mapping-string key="error">
            <template>
                <nimble-icon-xmark severity="error" title="Errored"></nimble-icon-xmark>
            </template>
        </nimble-mapping-string>
        <nimble-mapping-string key="pass">
            <template>
                <nimble-icon-check severity="success" title="Passed"></nimble-icon-check>
            </template>
        </nimble-mapping-string>
        <nimble-mapping-string key="running">
            <template>
                <nimble-spinner title="Running"></nimble-spinner>
            </template>
        </nimble-mapping-string>
    </nimble-table-column-mapping>
    <nimble-table-column-mapping field-name="required">
        Required?
        <nimble-mapping-boolean key="true">
            <template>
                <nimble-icon-check title="Required"></nimble-icon-check>
            </template>
        </nimble-mapping-boolean>
        <nimble-mapping-boolean key="false">
            <template>
            </template>
        </nimble-mapping-boolean>
    </nimble-table-column-mapping>
</nimble-table>
```

Note that the `key` attribute values are always given as strings. In the case of boolean or number mappings, this value is parsed to the appropriate type, so that it can properly be compared to the values from the row records.

```TS
import {
    attr,
    booleanConverter,
    nullableNumberConverter
} from '@microsoft/fast-element';

export class TableColumnNumberMapping extends TableColumnMapping {
    @attr({ converter: nullableNumberConverter })
    public override key: number | null = null;
}

export class TableColumnBooleanMapping extends TableColumnMapping {
    @attr({ converter: booleanConverter })
    public override key: boolean | null = null;
}

```

When none of the given mappings match the record value for a cell, that cell will be empty. Alternatively, we could provide support for a default mapping (i.e. `nimble-mapping-default`) that would be rendered when no other values matched. However this doesn't seem worth the effort/complexity.

**Alternatives:**

1. This mapping API was originally conceived to implement an icon column type. We could stick to the original, limited scope and define just a `nimble-table-column-icon` (mapping strings to icons). However we will likely need to take a very similar approach to implement columns supporting boolean and enum input types. It would be natural and efficient to have a single column type to support all three, and potentially other use cases in the future.

2. We could make the mapping table column an abstract base type, then derive more specific column types from it, e.g. `nimble-table-column-icon`, `nimble-table-column-enum`, `nimble-table-column-boolean`. However, this doesn't actually make much sense, because there is overlap between the icon column and the enum/boolean columns.

    Mappings of column types:

    - icon column:
        - number -> icon/spinner
        - string -> icon/spinner
        - boolean -> icon/spinner
    - enum column:
        - number -> text
        - string -> text
        - number -> icon/spinner
        - string -> icon/spinner
    - boolean column:
        - boolean -> text
        - boolean -> icon/spinner

    An icon column would cover half the use cases of enum and boolean columns. The remaining use cases would be covered by something like a mapped text column. This could be confusing to distinguish from our text column. Additionally, if we are going to have a column that maps numbers/strings/booleans to text, it might as well generalize to icons as well. In which case, we don't need a distinct icon column.

### API

#### Column element:

_Component Name_

-   `nimble-table-column-mapping`

_Props/Attrs_

-   `field-name`: string

_Content_

-   column title (text)
-   1 or more `nimble-mapping-*` elements

#### Mapping elements:

_Component Name_

-   `nimble-mapping-string` (maps string values)
-   `nimble-mapping-number` (maps number values)
-   `nimble-mapping-boolean` (maps boolean values)

_Props/Attrs_

-   `key`: string (property type matches component type, e.g. `number` for number mapping)
-   `description`: string

_Content_

-   exactly one `template` element, containg some combination of text, Nimble icons, or `nimble-spinner`

### Anatomy

#### `nimble-table-column-mapping`

```HTML
<template slot="${x => x.columnInternals.uniqueId}">
    <slot
        ${slotted('mappings')}
        name="mapping">
    </slot>
    <span class="header-content">
        <slot></slot>
    </span>
</template>
```

Cell view:

```HTML
<div
    ${ref('wrapper')}
    class="wrapper"
    @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.wrapper.innerText && x.wrapper.offsetWidth < x.wrapper.scrollWidth;
    }}"
    @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    title=${x => (x.isValidContentAndHasOverflow ? x.wrapper.innerText : null)}
>
    ${repeat(x => (x.column as TableColumnMapping).mappings,
        html<TableColumnMapping, TableColumnMappingCellView>`
            ${when((x, c) => x.key === (c.parent as TableColumnMappingCellView).cellRecord.value,
                html<TableColumnMapping>`
                    ${repeat(x => x.mappedTemplate,
                        html<HTMLTemplateElement>`${x => new ViewTemplate(x.innerHTML, [])}`
                    )}
                `
            )}
        `
    )}
</div>
```

Header view:

Note the following requires that `TableColumnMappingHeaderView` has a reference to the column with which it is associated. This is needed to enumerate the column's mapping elements.

```HTML
<div
    ${ref('wrapper')}
    class="wrapper"
    @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.wrapper.innerText && x.wrapper.offsetWidth < x.wrapper.scrollWidth;
    }}"
    @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    title=${x => (x.isValidContentAndHasOverflow ? x.wrapper.innerText : null)}
>
    ${repeat(x => (x.column as TableColumnMapping).mappings,
        html<TableColumnMapping, TableColumnMappingHeaderView>`
            ${when((x, c) => x.key === (c.parent as TableColumnMappingHeaderView).groupHeaderValue,
                html<TableColumnMapping>`
                    ${repeat(x => x.mappedTemplate,
                        html<HTMLTemplateElement>`${x => new ViewTemplate(x.innerHTML, [])}`
                    )}
                `
            )}
        `
    )}
</div>
```

For each mapping, if the key matches the value for this row, get the mapping's contained `template` and render its `innerHTML`.

#### `nimble-mapping-string/number/boolean`

```HTML
<template slot="mapping">
    <slot
        ${slotted({ property: 'mappedTemplate', filter: x => x instanceof HTMLTemplateElement })}
    >
    </slot>
</template>
```

### Grouping

Will support grouping by the record value. The grouping header will display the rendered html mapped to that value. If multiple different values map to the same rendered html (e.g. icon), there may be separate groups that visually look like they should be combined into one group. We could instead render the record value into the header, but that value is not otherwise exposed to the user. It may not even have much meaning (e.g. some numeric code). I think it is more reasonable to display the rendered html.

### Sorting

Sorting has the same issue as grouping, where visually identical cells could end up not sorted contiguously. Again, I believe this is reasonable.

### Sizing

We will support fixed or fractional widths for this column type.

### Angular integration

Angular directives will be created for the column component and the mapping components. The component will not have form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

A Blazor wrapper will be created for the component. _Initial attempts at prototyping resulted in exceptions being thrown and no icons being rendered. This is an open issue._

### Visual Appearance

Appearance can vary based on mapped html, but can only include text, icons, and Nimble spinner.

The cell view (and header view) will be responsible for styling the contents of the mapping `template`. This will include alignment and spacing (`--ni-nimble-small-padding`).

---

## Implementation

### States

N/A

### Accessibility

Text, icons, and spinner are not interactive and cannot receive keyboard focus.

The cell will not introduce any items into the accessibility tree other than the elements in the mapped template. Those items will already have appropriate accessibility tree representations.

We will instruct clients to provide an accessible name for each icon/spinner, either via the `title` or `aria-label` attribute. `aria-labelledby` is not an option, because it requires defining an `id` which will not be unique when duplicated accross multiple rows.

### Globalization

All text will be provided by the client and is expected to be localized.

### Security

N/A

### Performance

N/A

### Dependencies

None

### Test Plan

-   Unit tests will be written verifying the usual component expectations, plus:
    -   renders mapping matching the cell value (string, number, and boolean)
    -   behavior in the presence of non-unique mapping keys
    -   nothing rendered when value matches no mappings
    -   error thrown when non-parsable value is given to number/boolean mappings
    -   error thrown when mapping contents are not a single template element
-   Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
-   Visual Chromatic tests will be created

### Tooling

N/A

### Documentation

Documented in Storybook

---

## Open Issues

-   Should we throw an error if the user includes unsupported elements in the `nimble-mapping-*` template? Or is documenting the restrictions sufficient?
-   Can we give `TableColumnMappingHeaderView` a reference to the column with which it is associated?
-   Blazor support not working?
