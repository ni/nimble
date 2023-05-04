# Mapping Table Column

## Overview

The `nimble-table-column-mapping` is a component that supports rendering specific number, boolean, or string values as mapped icons, spinners, or text. `nimble-table-column-icon` is a specialized version of `nimble-table-column-mapping` which defaults to having a minimal, fixed width. The actual mappings are defined by child elements `nimble-mapping-icon`, `nimble-mapping-spinner`, and `nimble-mapping-text`.

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
    <nimble-table-column-icon field-name="status">
        Status
        <nimble-mapping-icon key="fail" icon="nimble-icon-xmark" severity="error" label="Failed"></nimble-mapping-icon>
        <nimble-mapping-icon key="error" icon="nimble-icon-xmark" severity="error" label="Errored"></nimble-mapping-icon>
        <nimble-mapping-icon key="pass" icon="nimble-icon-check" severity="success" label="Passed"></nimble-mapping-icon>
        <nimble-mapping-spinner key="running" label="Running..."></nimble-mapping-spinner>
    </nimble-table-column-icon>
    <nimble-table-column-mapping field-name="errorCode" data-type="number">
        Error Code
        <nimble-mapping-text key="1" label="A bad thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="2" label="A worse thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="3" label="A terrible thing happened"></nimble-mapping-text>
    </nimble-table-column-mapping>
    <nimble-table-column-icon field-name="archived" data-type="boolean">
        Archived
        <nimble-mapping-icon key="true" icon="nimble-icon-database" label="Archived"></nimble-mapping-icon>
    </nimble-table-column-icon>
</nimble-table>
```

Note that the `key` attribute values are always given as strings. In the case of boolean or number mappings, this value is parsed to the appropriate type, so that it can properly be compared to the values from the row records.

When none of the given mappings match the record value for a cell, that cell will be empty. Alternatively, we could provide support for marking a mapping with a `default` attribute that would cause it to be chosen when no other values matched. This would be equivalent to the `placeholder` configuration we provide on `nimble-table-column-text` and `nimble-table-column-anchor`. I don't think we need to support this initially.

If multiple mappings in a column have the same key, an error will be thrown.

If an invalid `icon` value is passed to `nimble-mapping-icon`, an error will be thrown.

`nimble-table-column-icon` supports only `nimble-mapping-icon` and `nimble-mapping-spinner` as mapping elements. Any others will result in an error being thrown. `nimble-table-column-mapping` supports all mapping elements.

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
-   `data-type`: 'string' | 'boolean' | 'number' (defaults to 'string')
-   `pixel-width`: number (defaults to minimum width supported by table)

_Content_

-   column title (text)
-   1 or more `nimble-mapping-icon` or `nimble-mapping-spinner` elements

#### General mapping column element:

_Component Name_

-   `nimble-table-column-mapping`

_Props/Attrs_

-   `field-name`: string
-   `data-type`: 'string' | 'boolean' | 'number' (defaults to 'string')
-   `pixel-width`: number (set to the desired fixed column width, else will have a fractional width)
-   `fractional-width`: number (defaults to 1)
-   `min-pixel-width`: number (defaults to minimum supported by table)

_Content_

-   column title (text)
-   1 or more `nimble-mapping-*` elements

#### Mapping element (icon):

_Component Name_

-   `nimble-mapping-icon`

_Props/Attrs_

-   `key`: string (will also have a private, typed version of this property)
-   `icon`: string - name of the Nimble icon element
-   `severity`: string - one of the supported enum values. Controls color of the icon.
-   `label`: string - localized value used as the accessible name and `title` of the icon

#### Mapping element (spinner):

_Component Name_

-   `nimble-mapping-spinner`

_Props/Attrs_

-   `key`: string (will also have a private, typed version of this property)
-   `label`: string - localized value used as the accessible name and `title` of the spinner

#### Mapping element (text):

_Component Name_

-   `nimble-mapping-spinner`

_Props/Attrs_

-   `key`: string (will also have a private, typed version of this property)
-   `label`: string - display text

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
${repeat(x => (x.column as TableColumnMapping).mappings,
    html<TableColumnMapping, TableColumnMappingCellView>`
        ${when((x, c) => x.typedKey === (c.parent as TableColumnMappingCellView).cellRecord.value,
            html<TableColumnMapping>`${x => x.cellViewTemplate}`
        )}
    `
)}
```

Group header view:

Similarly, the group header view relies on the matched mapping to provide a template to render.

Note the following requires that `TableColumnMappingGroupHeaderView` has a reference to the column with which it is associated. This is needed to enumerate the column's mapping elements.

```HTML
${repeat(x => (x.column as TableColumnMapping).mappings,
    html<TableColumnMapping, TableColumnMappingHeaderView>`
        ${when((x, c) => x.key === (c.parent as TableColumnMappingHeaderView).groupHeaderValue,
            html<TableColumnMapping>`${x => x.groupHeaderViewTemplate}`
        )}
    `
)}
```

#### `nimble-mapping-*`

```HTML
<template slot="mapping"></template>
```

#### `nimble-mapping-icon`

Cell view template:

```

```

### Grouping

Will support grouping by the record value. The grouping header will display the rendered icon/spinner/text. In the case of an icon/spinner, it will also be followed by the `label` text. This will disambiguate cases where multiple record values map to the same icon (assuming the labels are different). Text in a grouping header will be ellipsized and gain a tooltip if there is not enough room to display it all.

### Sorting

Sorting will be based on the record value. For icons, if multiple values map the to same icon, it is possible that sorting will result in the instances of a certain icon not being all together in one span of rows. The user may think they should be all together, but this is a corner case that we can't/shouldn't do anything about.

### Sizing

`nimble-table-column-icon` will support only a fixed width. We will introduce a new mixin for fixed-width support that exposes a `pixel-width` property. The default value will be the minimum supported by the table, which is still significantly larger than the width of an icon.

`nimble-table-column-mapping` will support fixed or fractional widths. If `pixel-width` is set, the column will have a fixed width, otherwise it defaults to a fractional width of 1. The client may configure `fractional-width` and/or `min-pixel-width`.

### Angular integration

Angular directives will be created for the column components and the mapping components. No component has form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

Blazor wrappers will be created for the components.

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
    -   error thrown when non-unique mapping keys exist
    -   error thrown when non-parsable value is given to number/boolean mappings
    -   error thrown when invalid icon name given
    -   error thrown when icon column has a `nimble-mapping-text` element
    -   grouping header for icon column includes label
-   Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
-   Visual Chromatic tests will be created

### Tooling

N/A

### Documentation

Documented in Storybook

---

## Open Issues
