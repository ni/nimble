# Row Grouping HLD

## Problem Statement

There is a requirement that users be able to group together rows of data under collapsible sections based on unique values in a particular column. Users need to be able to group by values in more than one column which will result in a collapsible "header" row for each grouped value.

This document will focus on the programmatic grouping of data rows.

### Out of Scope of this HLD

1. The proposal in this HLD is focusing on the broad strategy for providing a means for columns to specify how to render the group header associated with that column's values. It will not focus on particular concerns that some columns may have for how to render their value, such as any localization requirements. Ultimately, this strategy should provide a means to those ends without getting into the details of each.
2. This proposal will not provide a means for rendering values from multiple columns for the group header. TanStack does not support this, and we will not block ourselves on this restriction.
3. Interactive grouping concerns.

## Links To Relevant Work Items and Reference Material

-   [#1003 Programmatic grouping of data rows](https://github.com/ni/nimble/issues/1003)
-   [IxD Interactive Document](https://xd.adobe.com/view/6f3be15d-8503-4f1f-54b9-5bc27955b3e4-190a/screen/13edcacf-4e95-46b2-a7a8-83141afb3f2d)
-   [Keyboard Navigation](https://xd.adobe.com/view/fa09e396-dbb9-40b8-547f-1cf9eab35a0b-8c38/screen/61432aef-6dca-4b87-a62b-12ed17a927b4)
-   [Table README](./README.md)
-   [Table Design Doc](https://xd.adobe.com/view/5b476816-dad1-4671-b20a-efe796631c72-0e14/screen/d389dc1e-da4f-4a63-957b-f8b3cc9591b4/specs/)
-   [Icon Visual Designs](https://xd.adobe.com/view/1a9870c7-2510-4248-83a5-b0148e7a6763-4fcb/)
-   [Prototype branch](https://github.com/ni/nimble/tree/table-row-grouping-prototype) ([Storybook](https://60e89457a987cf003efc0a5b-bwzrahvxqm.chromatic.com/?path=/story/table--table))

## Implementation / Design

![Row Grouping Example](./spec-images/row-groups.PNG)

### Row Grouping Column API

To support both the notion that a column type may want to allow grouping in some situations and not others (e.g. a numeric column displaying discrete values versus continuous values), as well as the possibility that certain columns should never be groupable, we will create a mixin to provide the necessary grouping APIs:

```ts
export function mixinGroupableColumnAPI<
    TBase extends GroupableTableColumnConstructor
>(base: TBase) {
    abstract class GroupableColumn extends base {
        public groupingDisabled: boolean = false;

        public groupIndex?: number | null = null;

        /**
         * The custom element tag to use for rendering group header values.
         * Should derive from TableGroupHeaderView.
         */
        public abstract groupHeaderViewTag: string;

        public groupingDisabledChanged(): void {
            this.internalGroupingDisabled = this.groupingDisabled;
        }

        public groupIndexChanged(): void {
            this.internalGroupIndex = this.groupIndex;
        }

        public groupHeaderViewTagChanged(): void {
            this.internalGroupHeaderViewTag = this.groupHeaderViewTag;
        }
    }
    attr({ attribute: 'grouping-disabled', mode: 'boolean' })(
        GroupableColumn.prototype,
        'groupingDisabled'
    );
    attr({ attribute: 'group-index', converter: nullableNumberConverter })(
        GroupableColumn.prototype,
        'groupIndex'
    );
    observable(GroupableColumn.prototype, 'groupHeaderViewTag');

    return GroupableColumn;
}
```

The `TableColumn` will add the `internalGroupingDisabled`, `internalGroupIndex` and `internalGroupHeaderViewTag` APIs to provide that state where it is needed in the rest of the `Table` implementation.

This mixin can then be chained to other mixins in the following fashion:

```
export class TableColumnText extends mixinGroupableColumnAPI(
    mixinFractionalWidthColumnAPI(TableColumnBase)
) {}
```

A client would then be able to configure their `Table` in the following way in html to mark certain columns to be grouped by:

```html
<nimble-table>
    <nimble-table-column-text
        field-name="firstName"
        group-index="1"
    ></nimble-table-column-text>
    <nimble-table-column-text
        field-name="lastName"
        group-index="0"
    ></nimble-table-column-text>
    <nimble-table-column-text field-name="age"></nimble-table-column-text>
</nimble-table>
```

### Rendering group header values

Rendering group header values have similar concerns as rendering cell values, providing reason to adopt the pattern outlined in [the table state management PR (#1052)](https://github.com/ni/nimble/pull/1052) for columns to specify a custom element to use to render the value. As shown in the mixin snippet above, it will provide an abstract `groupHeaderViewTag` property, which will require groupable columns to specify the element to use to display the header value. This element will derive from an element of type `TableGroupHeaderView`:

```ts
export interface TableGroupHeaderState<
    TGroupValue = unknown,
    TColumnConfig = unknown
> {
    groupHeaderValue: TGroupValue;
    columnConfig?: TColumnConfig;
}

export abstract class TableGroupHeaderView<
        TGroupValue = unknown,
        TColumnConfig = unknown
    >
    extends FoundationElement
    implements TableGroupHeaderState<TGroupValue, TColumnConfig>
{
    @observable
    public groupHeaderValue: TGroupValue;

    @observable
    public columnConfig?: TColumnConfig;
}
```

The value of the `groupHeaderValue` property will be sourced from the TanStack [`groupingValue` property](https://tanstack.com/table/v8/docs/api/features/grouping#groupingvalue) of a given TanStack `Row` instance. This will be the value associated with the grouped column's `operandDataRecordFieldName` and have no formatting applied to it. Any formatting of the value for display purposes is up to the concrete implementation of a particular `TableGroupRowHeaderView`. The `columnConfig` value comes from the `TableColumn` instance used for grouping values by.

An example implementation for the custom element to use for rendering group header values for the `TableColumnText` might look like the following:

```ts
export class TableColumnTextGroupHeaderView extends TableGroupHeaderView<
string | null | undefined,
TableColumnTextColumnConfig
> {
    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    @volatile
    public get content(): string {
        return typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : this.columnConfig.placeholder;
    }
}

const tableColumnTextGroupHeaderView = TableColumnTextGroupHeaderView.compose({
    baseName: 'table-column-text-group-header',
    template: html<TableColumnTextGroupHeaderView>`
        <nimble-text-field readonly="true" value="${x => x.groupHeaderValue}" placeholder="${x => x.columnConfig.placeholder}">
        </nimble-text-field>`,
    styles: /* styling */
});
DesignSystem.getOrCreate().withPrefix('nimble').register(tableColumnTextGroupHeaderView());
```

### Rendering the row group

Rendering a row group has concerns beyond just rendering the grouping value. It also has a button for controlling the expand/collapse state of a row group (indented for sub-groups) as well as potentially rendering auxiliary information such as the total number of items within a group. We can provide a new `TableGroupRow` element to manage all of these:

```ts
export class TableGroupRow extends FoundationElement {
    @observable
    public groupRowValue?: unknown;

    @observable
    public nestingLevel: number = 0;

    @observable
    public leafItemCount?: number;

    @observable
    public columnConfig?: unknown;

    @observable
    public isExpanded: boolean = false;

    @observable
    public groupRowHeaderViewTag?: string;

    public onExpandGroupToggle(): void {
        const detail: TableGroupExpandToggleEventDetail = {
        };
        this.$emit('group-expand-toggle', detail);
    }

    ...
}

const tableGroupRowElement = TableGroupRow.compose({
    baseName: 'table-group-row',
    template: html<TableGroupRow>`
    <template
        role="rowgroup"
        style="--ni-private-row-group-indent-level: ${x => x.nestingLevel};"
    >
        <nimble-button
            appearance="ghost"
            content-hidden
            @click=${x => x.onExpandGroupToggle()}>
            ${when(x => x.isExpanded, html`
                <nimble-icon-arrow-expander-down slot="start"></nimble-icon-arrow-expander-down>
            `)}
            ${when(x => !x.isExpanded, html`
                <nimble-icon-arrow-expander-right slot="start"></nimble-icon-arrow-expander-right>
            `)}
        </nimble-button>
        <${x => x.rowGroupState.groupRowHeaderViewTag}
            :rowGroupValue="${x => x.groupRowValue}"
            :columnConfig="${x => x.columnConfig}"
            >
        </{x => x.rowGroupState.groupRowHeaderViewTag}> (${x => x.leafItemCount})
    </template>
    styles: /* styling */
});
DesignSystem.getOrCreate().withPrefix('nimble').register(tableGroupRowElement());
```

Grouped rows are provided alongside ungrouped rows through the TanStack function `getRowModel().rows`, which is already used for retrieving the rows to render. We can then provide all of the necessary state to render a `TableGroupRow` alongside the existing state in `TableRowState`. So to render the `TableGroupRows`, the template can make a simple change similar to this:

Table template.ts

```ts
    ...
    ${repeat(x => x.virtualizer.visibleItems, html<VirtualItem, Table>`
        ${when((x, c) => (c.parent as Table).tableData[x.index]?.isGrouped, html<VirtualItem, Table>`
            <${DesignSystem.tagFor(TableGroupRow)}
                :groupRowValue="${(x, c) => c.parent.tableData[x.index]?.groupRowValue}"
                ...
                @on-row-group-expand-toggle="${(x, c) => c.parent.toggleRowExpanded(x.index)}"
                >
            </${DesignSystem.tagFor(TableGroupRow)}>
        `)}
        ${when((x, c) => !(c.parent as Table).tableData[x.index]?.isGrouped, html<VirtualItem, Table>`
            <${DesignSystem.tagFor(TableRow)}
    ...
```

The one change necessary to support this properly is to change the virtualizer to use the current length of `getRowModel.rows()` for the `count` instead of the [current length of the table's data](https://github.com/ni/nimble/blob/f60dedf600147b16916f876b749a4e019c2a6308/packages/nimble-components/src/table/models/virtualizer.ts#L82) (see [prototype](https://github.com/ni/nimble/blob/5cd05ab733b00ebb33e44d53c7be30c980fa3398/packages/nimble-components/src/table/models/virtualizer.ts#L87)).

### Row interaction summary

-   Group rows will perform an expand/collapse operation when clicked anywhere on the row.
-   The expand/collapse button for group rows will not have button hover/click visual state
-   The group row will change its background color on hover
-   No elements within a group row will be focusable.
-   To navigate between rows a user will click the UP or DOWN arrows
-   To expand/collapse rows a user will click ALT UP or ALT DOWN arrows
-   When a row is focused (via the UP or DOWN arrows), if a screen reader is active it should read the header text and the total row count.

### Auto expanding groups

The `Table` will have the behavior such that when it receives new data, any new group row will display expanded by default. If a group row already existed when new data is set, if that group row had been collapsed, it will remain collapsed. If a user changes the grouping configuration, we will expand all group rows.

There will be no additional API to configure this behavior. If we determine that such an API is needed we can always add it.

### Column header grouping visual

Ultimately, when a column has set itself to be grouped, the design calls for that to be represented with a visual in the header for that column. This will be handled in a similar fashion to how we represent sort direction, by providing a new `grouped` attribute on `TableHeader` to determine whether to show the appropriate icon.

### Interfacing with TanStack

As shown in the above example, the `TableGroupRow` will provide a button to control expand/collapse behavior. TanStack handles the modeling for which rows are expanded or collapsed (in addition to which rows are groups), and thus must be notified of an expand/collapse action. This will be accomplished through raising an event (`group-expand-toggle` in the example above). The `Table` will handle the event, and call `stopPropogation` on it, as there is not an immediate need to leak this into the public event API of the `Table`.

Setting TanStack up to handle both row grouping and expanded state is similar to what is in place for sorting. One notable difference is that we will need to register a handler for TanStack's `onExpandedChange` handler, as we will be working through TanStack to update this state, and the `Table` will need a notification in order to re-render the rows. It would look similar to the following:

Table index.ts

```ts
public constructor() {
    super();
    this.options = {
        data: [],
        onStateChange: (_: TanStackUpdater<TanStackTableState>) => {},
        onExpandedChange: this.handleExpandedChange,
        ...

```

### Validation

The table will be invalid if it contains two columns with the same `group-index`. If a duplicate `group-index` is detected, the rows in the table will not render, and the table's validity object will have `duplicateColumnGroupIndex` set to `true`.

## Alternative Implementations / Designs

### Rendering more than one column value in group header

Consider upstreaming a change to TanStack to allow row grouping by more than one column value. While this may not affect the overall architectural design proposed here, it would likely alter it to support providing multiple values to render in the `TableGroupHeaderView`.

### Group on formatted values

We decided against grouping on formatted values since TanStack will only determine its grouping based on the raw, unformatted values in the columns. Circumventing this would invariably lead to us losing much of the state management TanStack provides.

## Open Issues

1. Do we always render the number of items in a row group as part of the header, or should this be configurable?
2. Should the `TableGroupRow` be given an ARIA role of `rowgroup`? The docs state that "a `rowgroup` contains one or more rows...", which the `TableGroupRow` technically does not. The virtualization implementation requires a pretty opinionated representation of the elements in the DOM, making it difficult to parent `TableRow` elements within a `TableGroupRow`.
