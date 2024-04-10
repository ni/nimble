# Mapping Table Column

## Overview

The `nimble-table-column-enum` is a component that supports rendering specific number, boolean, or string values as an icon, a spinner, text, or an icon/spinner with text. The mappings are defined by child elements of `nimble-mapping-icon`, `nimble-mapping-spinner`, `nimble-mapping-text`, or `nimble-mapping-empty`.

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
    -   Icon with text
    -   Spinner with text
    -   (empty)

### Non-goals

-   Non-Nimble icon support
-   Arbitrary icon colors
-   Hyperlink icons
-   Non-icon, non-spinner Nimble components
-   Specifying different text for an icon/spinner's label than the overall text of the mapping
-   Detecting that only icons/spinners can be rendered in the cells and column header and automatically making the column non-resizable and 32px

---

## Design

Below is an example of how these elements would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-enum field-name="status" key-type="string">
        Status
        <nimble-mapping-icon key="fail" icon="nimble-icon-xmark" severity="error" text="Failed"></nimble-mapping-icon>
        <nimble-mapping-icon key="error" icon="nimble-icon-xmark" severity="error" text="Errored"></nimble-mapping-icon>
        <nimble-mapping-icon key="pass" icon="nimble-icon-check" severity="success" text="Passed"></nimble-mapping-icon>
        <nimble-mapping-spinner key="running" text="Running"></nimble-mapping-spinner>
    </nimble-table-column-enum>
    <nimble-table-column-enum field-name="errorCode" key-type="number">
        Error Code
        <nimble-mapping-text key="1" text="A bad thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="2" text="A worse thing happened"></nimble-mapping-text>
        <nimble-mapping-text key="3" text="A terrible thing happened"></nimble-mapping-text>
    </nimble-table-column-enum>
    <nimble-table-column-enum field-name="archived" key-type="boolean">
        Archived
        <nimble-mapping-icon key="true" icon="nimble-icon-database" text="Archived" text-hidden></nimble-mapping-icon>
        <nimble-mapping-empty key="false" text="Not archived"></nimble-mapping-empty>
    </nimble-table-column-enum>
</nimble-table>
```

Each column contains mapping elements that define what to render when the cell's value matches the given `key` value.

When none of the given mappings match the record value for a cell, that cell will be empty. While the table will not enter an error state, this is considered invalid data from the table's perspective and should be fixed within the client application.

The column will translate its contained mapping elements into a map that is stored in the `columnConfig`.

Validation will be performed to ensure each mapping's key value can be converted to the `key-type` of the column. If not, an error flag will be set on the column's validation object. Note that whenever an error flag is set on the column's validation object, a generic `invalidColumnConfiguration` flag is also set on the table, putting it in an invalid state as well.

If multiple mappings in a column have the same key, an error flag will be set on the column's validity object.

If an invalid `icon` value is passed to `nimble-mapping-icon`, an error flag will be set on the column's validity object. An invalid `icon` value is any element that cannot be resolved or that does not derive from `Icon`.

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

#### Enum column element:

_Component Name_

-   `nimble-table-column-enum`

_Props/Attrs_

-   `field-name`: string
-   `key-type`: 'string' | 'number' | 'boolean'
-   `width-mode`: enum - `flexibleWidth` (default) | `fixedIconWidth` - When set to `fixedIconWidth`, the column will have a fixed width that makes the column the appropriate width to render only a single icon in the cell. This should only be set when the header contains a single icon (no text) and none of the child mapping elements will result in text being rendered in a cell.

_Content_

-   column title (icon and/or text)
-   1 or more `nimble-mapping-icon`, `nimble-mapping-spinner`, `nimble-mapping-text`, or `nimble-mapping-empty` elements

#### Mapping element (icon):

The icon mapping element will support displaying an icon, icon with text, or only text in a cell. If only text is displayed in a cell, space will be reserved for an icon so that the text associated with all icon mapping elements is aligned. A group row associated with an icon mapping element will always display the icon, if specified, and text.

_Component Name_

-   `nimble-mapping-icon`

_Props/Attrs_

-   `key`: string | number | boolean | undefined
-   `icon`: string | undefined - name of the Nimble icon element. If `undefined`, no icon will be associated with the given `key`, but space will be reserved in the cell for an icon.
-   `severity`: string - one of the supported enum values. Controls color of the icon.
-   `text`: string - localized value associated with the given `key`.
-   `text-hidden`: boolean - When set, the mapping's text will not be rendered within a cell. When unset, the text will be rendered in a cell. This does not affect the rendering of group rows; group rows will always display the text associated with the mapping.

The text will be used in the following places:

-   In the group row for a mapping
-   If `text-hidden` is set, as the accessible name and `title` of the icon within a cell
-   If `text-hidden` is not set, as text rendered next to the icon within a cell

#### Mapping element (spinner):

The spinner mapping element will support displaying a spinner or spinner with text in a cell. A group row associated with a spinner mapping element will always display the spinner and text.

_Component Name_

-   `nimble-mapping-spinner`

_Props/Attrs_

-   `key`: string | number | boolean | undefined
-   `text`: string - localized value associated with the given `key`.
-   `text-hidden`: boolean - When set, the mapping's text will not be rendered within a cell. When unset, the text will be rendered in a cell. This does not affect the rendering of group rows; group rows will always display the text associated with the mapping.

The text will be used in the following places:

-   In the group row for a mapping
-   If `text-hidden` is set, as the accessible name and `title` of the spinner within a cell
-   If `text-hidden` is not set, as text rendered next to the spinner within a cell

#### Mapping element (text):

The text mapping element will support displaying text in a cell. A group row associated with a text mapping will also display the text associated with the mapping.

_Component Name_

-   `nimble-mapping-text`

_Props/Attrs_

-   `key`: string | number | boolean | undefined
-   `text`: string - display text

#### Mapping element (empty):

The empty mapping element will display an empty cell. A group row associated with an empty mapping will display the mapping's text. The purpose of the empty mapping element is to allow clients to avoid cluttering their table with information that isn't particularly helpful to a user (e.g. that the state of a system is 'idle') while still having a good grouping experience that ensures group rows are not empty.

_Component Name_

-   `nimble-mapping-empty`

_Props/Attrs_

-   `key`: string | number | boolean | undefined
-   `text`: string - display text

#### `nimble-mapping-*`

```HTML
<template slot="mapping"></template>
```

#### `nimble-mapping-icon`

`mapping.cellViewTemplate`:

```HTML
<${this.icon}
    title="${x => x.textHidden ? x.text: null}"
    role="img"
    aria-label="${x  => x.textHidden ? x.text: null}"
    aria-hidden="${x => x.textHidden ? 'false' : 'true'}"
    severity="${x => x.severity}">
</${this.icon}>
${when(() => !x.textHidden, html`
    <span>${x => x.text}</span>
`)}
```

`mapping.groupHeaderViewTemplate`:

```HTML
<${this.icon}
    aria-hidden="true"
    severity="${x => x.severity}">
</${this.icon}>
<span>
    ${x => x.text}
</span>`;
```

### Grouping

Grouping will be based on the record value. The grouping header will display the rendered text along with the icon/spinner, if configured.

For values that do not match any mapping, the group row will display only the count. This is considered invalid data from the table's perspective and should be fixed within the client application.

Text in a grouping header will be ellipsized and gain a tooltip if there is not enough room to display it all.

### Sorting

Sorting will be based on the record value. For boolean and number values, a basic sort (just using basic comparison/equality operators) is the clear choice. For string values, it is less clear. In the case where the strings are enum values, they are likely to be non-localized, English strings. Using a basic (alphabetical) sort is not unreasonable. However, if there is a semantically meaningful sort order (e.g. "NOT_STARTED" < "RUNNING" < "DONE"), it would be nice to sort by that. We can only infer that semantic order from the order in which the mappings are given, e.g.:

```HTML
    <nimble-mapping-text key="NOT_STARTED" text="Not Started"></nimble-mapping-text>
    <nimble-mapping-text key="RUNNING" text="Running"></nimble-mapping-text>
    <nimble-mapping-text key="DONE" text="Done"></nimble-mapping-text>
```

We would need new support for sorting this way. We could define a new sorting option, "enumerated sort", where the column provides an ordered list of values, and the table sorts the column based on that given order. To compare the relative order of two values, we have to search the list, making the sort operation a bit more expensive, but still probably reasonable except in the case of enums with many values.

Our options are to use a basic sort (for all three value types), use an enumerated sort (again, for all three value types), or to start with a basic sort and implement the enumerated sort at a later time. Settling for a basic sort is reasonable and the easiest solution, but it would not give as nice an experience as an enumerated sort. The enumerated sort would expand the scope of this feature and could easily be implemented as a standalone change. For those reasons, I propose we use a basic sort for the initial submission of the column type, and add the enumerated sort and adopt that for the mapping/icon column as follow-on work.

For icons, if multiple values map to the same icon, it is possible that sorting will result in the instances of a certain icon not being all together in one span of rows. Users will be expected to provide visually distinct icons for each mapping as the column will not enforce or validate distinct icons for each mapping.

### Sizing

By default, the `nimble-table-column-enum` will be a fractional width column with a fractional width of 1. However, it can be configured to be a fixed pixel size (32px) and not be resizable by setting `width-mode` to `fixedIconWidth`. The 32px fixed size allows room from a single icon or spinner along with left and right cell padding of 8px each.

When the column is a fixed 32px:

-   The grouping indicator and sorting indicator will be hidden in the column header.
-   A client is expected to only place an icon as the header content of an icon column.
-   A user cannot resize an icon column.
-   Column sizing configuration on the column, such as `fractional-width`, will be ignored.

This will be accomplished through the following configuration on the column:

-   The icon column will set `columnInternals.resizingDisabled` to `true`.
-   The icon column will set both `columnInternals.pixelWidth` and `columnInternals.minPixelWidth` to `32`, which is equal to the icon size plus left and right paddings of 8px

### Angular integration

Angular directives will be created for the column components and the mapping components. No component has form association, so a `ControlValueAccessor` will not be created.

### Blazor integration

Blazor wrappers will be created for the components. Columns will be generic in the type of the key, and will cascade that type parameter to contained mapping elements (see [`CascadingTypeParameter`](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/generic-type-support?view=aspnetcore-7.0#cascaded-generic-type-support)):

```HTML
<NimbleTableColumnEnum TKey=int Field="NumberData">
    <NimbleMappingText Key="1" Text="foo"></NimbleMappingText>
    <NimbleMappingText Key="2" Text="bar"></NimbleMappingText>
</NimbleTableColumnEnum>
```

### Visual Appearance

The cell view (and group header view) will be responsible for styling the templates returned by the mappings. This will include alignment and spacing (`--ni-nimble-small-padding`).

---

## Implementation

### States

N/A

### Accessibility

-   Text, icons, and spinner are not interactive and cannot receive keyboard focus.
-   In group rows, the rendered icon/spinner will have `aria-hidden="true"` set because the text is displayed directly next to the icon. The icon/spinner is purely decorative, and it does not contain any additional information that needs to be available with a screen reader.
-   In table cells, if an icon/spinner is displayed with the text, the icon/spinner will have `aria-hidden="true"` set for the same reason explained for group rows above. However, if the text is not displayed, the icon/spinner will have a role of `img` and use the text as its `title` and `aria-label`.

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
    -   validation error when invalid icon name given
    -   grouping header for icon column includes text
-   Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
-   Verify manually that several mapping columns with thousands of elements scrolls performantly.
-   Visual Chromatic tests will be created

### Tooling

N/A

### Documentation

Documented in Storybook

---

## Open Issues
