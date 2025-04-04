# Mapping Anchor Table Column

## Overview

The `nimble-table-column-mapping-anchor` is a component that supports rendering specific number, boolean, or string values as an icon or a spinner, with an accompanying text anchor element. The mappings are defined by child elements of `nimble-mapping-icon`, `nimble-mapping-spinner`, or `nimble-mapping-empty`.

### Background

[Icon with anchor column](https://github.com/ni/nimble/issues/2531)

### Features

- Supported input:
    - string
    - number
    - boolean
- Supported output:
    - Icon with text link
    - Spinner with text link
    - text link

### Non-goals

- Non-Nimble icon support
- Arbitrary icon colors
- Non-icon, non-spinner Nimble components
- Specifying different text for an icon/spinner's label than the overall text of the mapping

---

## Design

Below is an example of how these elements would be used within a `nimble-table`:

```HTML
<nimble-table>
    <nimble-table-column-mapping-anchor field-name="status" key-type="string" label-field-name="status" href-field-name="status-url">
        Status
        <nimble-mapping-icon key="fail" icon="nimble-icon-xmark" severity="error" text="Failed"></nimble-mapping-icon>
        <nimble-mapping-icon key="error" icon="nimble-icon-xmark" severity="error" text="Errored"></nimble-mapping-icon>
        <nimble-mapping-icon key="pass" icon="nimble-icon-check" severity="success" text="Passed"></nimble-mapping-icon>
        <nimble-mapping-spinner key="running" text="Running"></nimble-mapping-spinner>
    </nimble-table-column-mapping-anchor>
</nimble-table>
```

The notable distinction between this column type and the `nimble-table-column-mapping` is the `label-field-name` and `href-field-name` attributes, and the absence of supporting the `nimble-mapping-text` as one of its mapping types. The two new attributes are aligned with the `nimble-table-column-anchor` API, and provide the fields in the table record for the text and URL for the displayed link. The `nimble-mapping-text` mapping will not be supported as it seems unnecessary for the use-cases needed.

See the [Mapping Table Column spec](./table-column-mapping.md#design), and the [Anchor Table Column spec](./table-column-anchor-hld.md#implementation--design) for more details related to the design.

### API

#### Enum column element:

_Component Name_

- `nimble-table-column-mapping-anchor`

_Props/Attrs_

##### Attributes inherited from TableColumnEnumBase

- `field-name`: string
- `key-type`: 'string' | 'number' | 'boolean'

##### Attributes "copied" from TableColumnAnchor (intend to move to mixin)

- `label-field-name`: string
- `href-field-name`: string
- `appearance`: string
- `underline-hidden`: string
- `hreflang`
- `ping`
- `referrerpolicy`
- `rel`
- `target`
- `type`
- `download`

Attributes from [`FractionalWidth`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table-column/mixins/fractional-width-column.ts), [`GroupableColumn`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table-column/mixins/groupable-column.ts), and [`Placeholder`](https://github.com/ni/nimble/blob/main/packages/nimble-components/src/table-column/mixins/placeholder.ts) mixins.

_Content_

- column title (icon and/or text)
- 1 or more `nimble-mapping-icon`, `nimble-mapping-spinner`, or `nimble-mapping-empty` elements

### Cell Template

The cell template will essentially be a combination of the `TableColumnMappingCellView` and `TableColumnAnchorCellView`.

```html
<span class="reserve-icon-size"> ${x => x.visualizationTemplate} </span>
When cellRecord.href present
<nimble-anchor
    href="${x => x.cellRecord.href}"
    hreflang="${x => x.columnConfig.hreflang}"
    ping="${x => x.columnConfig.ping}"
    referrerpolicy="${x => x.columnConfig.referrerpolicy}"
    rel="${x => x.columnConfig.rel}"
    target="${x => x.columnConfig.target}"
    type="${x => x.columnConfig.type}"
    download="${x => x.columnConfig.download}"
    underline-hidden
    @mouseover="${(x, c) => setTitleWhenOverflow(...)}"
    @mouseout="${(x, c) => removeTitle(...)}"
>
    ${cellState.cellRecord.label ?? cellState.cellRecord.href}
</nimble-anchor>
When cellRecord.href is missing
<span
    @mouseover="${(x, c) => setTitleWhenOverflow(...)}"
    @mouseout="${(_x, c) => removeTitle(...)}"
>
    ${cellState.cellRecord.label}
</span>
```

### Sorting

Sorting will be based on the record value, following what is described in the [Mapping Table Column spec](./table-column-mapping.md#sorting), meaning the column will ultimately be sorted according to the icon "value" and not by the label or URL (as it is with the anchor column).

### Sizing

The column should support the same sizing modes as the text column, which is fractional widths plus minimum pixel widths.

### Keyboard Interactions

Arrowing to a anchor table cell should focus the link (if it is actually a link and not just a text span). Pressing `Enter` on a focused link will trigger navigation.

### Accessibility Roles

In the accessibility tree, the cells of an anchor column are instances of [`nimble-table-cell`](https://github.com/ni/nimble/blob/f663c38741e731bef91aa58e8fb2d1cec653b679/packages/nimble-components/src/table/components/cell/template.ts#L6) which has a `role` of [`cell`](https://w3c.github.io/aria/#cell). The cell then has a child `nimble-anchor`, which has a `role` of [`link`](https://w3c.github.io/aria/#link).

### Angular integration

Angular directives will be created for the column component. No component has form association, so a `ControlValueAccessor` will not be created.

#### Angular Routing support

Using the `TableColumnAnchor` in Angular requires the use of the [`NavigationGuard`](https://github.com/ni/nimble/blob/main/packages/angular-workspace/nimble-angular/table-column/anchor/nimble-table-column-anchor-navigation-guard.directive.ts) in order to allow proper routing within the Angular application.

### Blazor integration

Blazor wrappers will be created for the components. Columns will be generic in the type of the key, and will cascade that type parameter to contained mapping elements (see [`CascadingTypeParameter`](https://learn.microsoft.com/en-us/aspnet/core/blazor/components/generic-type-support?view=aspnetcore-7.0#cascaded-generic-type-support)):

```HTML
<NimbleTableColumnMappingAnchor TKey=string Field="Status" LabelField="StatusField" HrefField="StatusURL">
    <NimbleMappingIcon
        Key="@("success")"
        Icon="nimble-icon-check"
        Severity="IconSeverity.Success">
    </NimbleMappingIcon>
    <NimbleMappingSpinner
        Key=@("calculating")>
    </NimbleMappingSpinner>
</NimbleTableColumnMapping>
```

### Globalization

All text will be provided by the client and is expected to be localized.

### Security

N/A

### Performance

N/A

### Dependencies

None

### Test Plan

- Unit tests will be written verifying the usual component expectations, plus:
    - renders mapping matching the cell value (string, number, and boolean)
    - nothing rendered when value matches no mappings
    - validation error when non-unique mapping keys exist
    - validation error when invalid icon name given
    - grouping header for icon column includes text
- Verify manually that the column content appears in the accessibility tree and can be read by a screen reader.
- Verify manually that several mapping columns with thousands of elements scrolls performantly.
- Visual Chromatic tests will be created

### Tooling

N/A

### Documentation

Documented in Storybook

---

## Open Issues
