# Mapping Table Column

## Overview

The `nimble-table-column-mapping` is a component that supports rendering specific number, boolean, or string values as mapped text. `nimble-table-column-icon` is a specialized version of `nimble-table-column-mapping` that instead maps values to icons and/or spinners and has a minimal, fixed width. The actual mappings are defined by child elements `nimble-mapping-icon`, `nimble-mapping-spinner`, and `nimble-mapping-text`.

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
    -   Icon
    -   Spinner
    -   (empty)

### Non-goals

-   Non-Nimble icon support
-   Arbitrary icon colors
-   Hyperlink icons
-   Mixed text and icons
-   Non-icon, non-spinner Nimble components

---

## Design

Below is an example of how these elements would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-icon field-name="status" key-type="string">
        Status
        <nimble-mapping-icon key="fail" icon="nimble-icon-xmark" severity="error" label="Failed"></nimble-mapping-icon>
        <nimble-mapping-icon key="error" icon="nimble-icon-xmark" severity="error" label="Errored"></nimble-mapping-icon>
        <nimble-mapping-icon key="pass" icon="nimble-icon-check" severity="success" label="Passed"></nimble-mapping-icon>
        <nimble-mapping-spinner key="running" label="Running"></nimble-mapping-spinner>
    </nimble-table-column-icon>
    <nimble-table-column-mapping field-name="errorCode" key-type="number">
        Error Code
        <nimble-mapping-text key="1" label="A bad thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="2" label="A worse thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="3" label="A terrible thing happened"></nimble-mapping-text>
    </nimble-table-column-mapping>
    <nimble-table-column-icon field-name="archived" key-type="boolean">
        Archived
        <nimble-mapping-icon key="true" icon="nimble-icon-database" label="Archived"></nimble-mapping-icon>
    </nimble-table-column-icon>
</nimble-table>
```

Each column contains mapping elements that define what to render when the cell's value matches the given `key` value.

When none of the given mappings match the record value for a cell, that cell will be empty. Alternatively, if one of the mappings has the `default` attribute, it will match when no other mappings have. This is equivalent to the `placeholder` configuration we provide on `nimble-table-column-text` and `nimble-table-column-anchor`.

The column will translate its contained mapping elements into a map that is stored in the `columnConfig`.

Validation will be performed to ensure each mapping's key value can be converted to the `key-type` of the column. If not, an error flag will be set on the column's validation object. Note that whenever an error flag is set on the column's validation object, a generic `invalidColumnConfiguration` flag is also set on the table, putting it in an invalid state as well.

If multiple mappings in a column have the same key, an error flag will be set on the column's validity object.

If an invalid `icon` value is passed to `nimble-mapping-icon`, an error flag will be set on the column's validity object. An invalid `icon` value is any element that cannot be resolved or that does not derive from `Icon`.

`nimble-table-column-icon` supports only `nimble-mapping-icon` and `nimble-mapping-spinner` as mapping elements. `nimble-table-column-mapping` supports only `nimble-mapping-text`. Unsupported mappings will result in an error flag being set on the column's validity object.

Text in a grouping header or in the cell will be ellipsized and gain a tooltip when the full text is too long to display.

**Alternatives:**

An earlier version of this spec proposed mapping elements with `template` elements as content instead of relying on attribute configuration. The template element would define the mapped html to render. We would impose restrictions on the types of supported elements that could be provided in the template.

Pros:

-   It would not require updates to the API if we needed to support new types of mapped content (e.g. icon with text), or if the mapped content itself got new configuration options (e.g. a scaling factor for icons).
-   Undefined element types caught at compile time.

Cons:

-   Verbose. Requires user to create `template` element and wrap text in `span`s for styling purposes.
-   Requires difficult validation to ensure only supported elements are present in the `template`.
-   Could allow users to provide inline styling.
-   Blazor: cannot put Blazor components inside `template`--must use raw Nimble elements without type safety

### API

#### Icon column element:

_Component Name_

-   `nimble-table-column-icon`

_Props/Attrs_

-   `field-name`: string
-   `key-type`: 'string' | 'number' | 'boolean'
-   `pixel-width`: number (set to the desired fixed column width, else will use a default fixed width)

_Content_

-   column title (text or icon)
-   1 or more `nimble-mapping-icon` or `nimble-mapping-spinner` elements

#### General mapping column element:

_Component Name_

-   `nimble-table-column-mapping`

_Props/Attrs_

-   `field-name`: string
-   `key-type`: 'string' | 'number' | 'boolean'
-   `fractional-width`: number (defaults to 1)
-   `min-pixel-width`: number (defaults to minimum supported by table)

_Content_

-   column title (text or icon)
-   1 or more `nimble-mapping-text` elements

#### Mapping element (icon):

_Component Name_

-   `nimble-mapping-icon`

_Props/Attrs_

-   `key`: string | number | boolean | null
-   `icon`: string - name of the Nimble icon element
-   `severity`: string - one of the supported enum values. Controls color of the icon.
-   `label`: string - localized value used as the accessible name and `title` of the icon. Will also be displayed in the group header.
-   `default`: boolean - presence causes this mapping to be used when no others match the value

#### Mapping element (spinner):

_Component Name_

-   `nimble-mapping-spinner`

_Props/Attrs_

-   `key`: string | number | boolean | null
-   `label`: string - localized value used as the accessible name and `title` of the spinner. Will also be displayed in the group header.
-   `default`: boolean - presence causes this mapping to be used when no others match the value

#### Mapping element (text):

_Component Name_

-   `nimble-mapping-text`

_Props/Attrs_

-   `key`: string | number | boolean | null
-   `label`: string - display text
-   `default`: boolean - presence causes this mapping to be used when no others match the value

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

The cell view relies on the matched mapping to provide a template to render.

```HTML
<div ${ref('wrapper') class="wrapper"}>
    ${repeat(x => x.columnConfig.mappings,
        html<Mapping, TableColumnMappingCellView>`
            ${when((x, c) => x.key === (c.parent as TableColumnMappingCellView).cellRecord.value,
                html<Mapping>`${x => x.cellViewTemplate}`
            )}
        `
    )}
</div>
${when(x => x.wrapper.childElementCount === 0, html<TableColumnMappingCellView>`
    ${repeat(x => x.columnConfig.mappings,
        html<Mapping, TableColumnMappingCellView>`
            ${when((x, c) => x.default,
                html<Mapping>`${x => x.cellViewTemplate}`
            )}
        `
    )}
`)}
```

Group header view:

Similarly, the group header view relies on the matched mapping to provide a template to render.

```HTML
<div ${ref('wrapper') class="wrapper"}>
    ${repeat(x => x.columnConfig.mappings,
        html<Mapping, TableColumnMappingHeaderView>`
            ${when((x, c) => x.key === (c.parent as TableColumnMappingHeaderView).groupHeaderValue,
                html<Mapping>`${x => x.groupHeaderViewTemplate}`
            )}
        `
    )}
</div>
${when(x => x.wrapper.childElementCount === 0, html<TableColumnCellView>`
    ${x => x.cellRecord.value)}}
`)}
```

#### `nimble-mapping-*`

```HTML
<template slot="mapping"></template>
```

#### `nimble-mapping-icon`

`mapping.cellViewTemplate`:

```HTML
<${this.icon}
    title="${x => x.label}"
    aria-label="${x => x.label}"
    severity="${x => x.severity}">
</${this.icon}>
```

`mapping.groupHeaderViewTemplate`:

```HTML
<${this.icon}
    title="${x => x.label}"
    aria-label="${x => x.label}"
    severity="${x => x.severity}">
</${this.icon}>
<span
    ${ref('span')}
    @mouseover="${x => {
        x.isValidContentAndHasOverflow = !!x.label && x.span!.offsetWidth < x.span!.scrollWidth;
    }}"
    @mouseout="${x => {
        x.isValidContentAndHasOverflow = false;
    }}"
    title=${x => (x.isValidContentAndHasOverflow ? x.label : null)}>
    ${x => x.label}
</span>`;
```

### Grouping

Grouping will be based on the record value. The grouping header will display the rendered icon/spinner/text. In the case of an icon/spinner, it will also be followed by the `label` text. This will disambiguate cases where multiple record values map to the same icon (assuming the labels are different).

For values that do not match any mapping, we will display the raw data value. While this introduces inconsistency, it seems preferable to the alternative, which is having multiple, separate groupings with a blank header (well, with just the item count in parens). Even in the case where there is a default mapping, we would still end up with separate groups with the identical default mapped icon and/or text, which is just a bad.

Text in a grouping header will be ellipsized and gain a tooltip if there is not enough room to display it all.

### Sorting

Sorting will be based on the record value. For boolean and number values, a basic sort (just using basic comparison/equality operators) is the clear choice. For string values, it is less clear. In the case where the strings are enum values, they are likely to be non-localized, English strings. In that case, even if there is a semantically meaningful sort order (i.e. "NOT_STARTED" < "RUNNING" < "DONE"), we can't sort that way. Settling for a basic sort in this case seems just as reasonable as anything else. If the strings are localized, it's more likely the client would use a text column instead. If we did want to support a different sorting method for strings than booleans/numbers, it would be awkward to implement. We would have update the column's sort method when the data changes, and the column would have to determine the data type for its field, which might require looking at multiple records (e.g. if the first didn't define that field). For these reasons, we will just use a basic sort for all supported data types (string, boolean and number).

For icons, if multiple values map the to same icon, it is possible that sorting will result in the instances of a certain icon not being all together in one span of rows. The user may think they should be all together, but this is a corner case that we can't/shouldn't do anything about.

### Sizing

`nimble-table-column-icon` will support only a fixed width. We will introduce a new mixin for fixed-width support that exposes a `pixel-width` property. The default value will be the minimum supported by the table, which is still significantly larger than the width of an icon.

`nimble-table-column-mapping` will support fixed or fractional widths. If `pixel-width` is set, the column will have a fixed width, otherwise it defaults to a fractional width of 1. The client may configure `fractional-width` and/or `min-pixel-width`.

### Angular integration

Angular directives will be created for the column components and the mapping components. No component has form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

Blazor wrappers will be created for the components. Columns will be generic in the type of the key, and will cascade that type parameter to contained mapping elements (see [`CascadingTypeParameter`](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/generic-type-support?view=aspnetcore-7.0#cascaded-generic-type-support)):

```HTML
<NimbleTableColumnMapping TKey=int Field="NumberData">
    <NimbleMappingText Key="1" Label="foo"></NimbleMappingText>
    <NimbleMappingText Key="2" Label="bar"></NimbleMappingText>
</NimbleTableColumnMapping>
```

### Visual Appearance

The cell view (and group header view) will be responsible for styling the templates returned by the mappings. This will include alignment and spacing (`--ni-nimble-small-padding`). Unfortunately, because the mappings cannot provide CSS to go with the templates they return, some implementation knowledge will leak from the mappings to the cell/group header views. For example, we must set `flex-shrink: 0` on all elements so that icons do not get smaller in a group header when the adjacent label takes up all the space.

---

## Implementation

### States

N/A

### Accessibility

Text, icons, and spinner are not interactive and cannot receive keyboard focus. These items already have proper accessibility roles, and we will set accessible names (`aria-label`) based on the `label` value provided by the client.

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
    -   nothing rendered when value matches no mappings
    -   validation error when non-unique mapping keys exist
    -   validation error when multiple mappings marked as default
    -   validation error when mapping key is null and not marked default
    -   validation error when invalid icon name given
    -   validation error when icon column has a `nimble-mapping-text` element
    -   grouping header for icon column includes label
-   Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
-   Verify manually that several mapping columns with thousands of elements scrolls performantly.
-   Visual Chromatic tests will be created

### Tooling

N/A

### Documentation

Documented in Storybook

---

## Open Issues
