# Nimble Table Columns API

## Problem Statement

The `nimble-table` requires users to be able to configure which columns to display for a table. Additionally, a particular display column may require access to multiple fields in the data, and allow a user to define the field to sort by. We need to provide a means for a client to provide their own column visualization. Finally, columns must also specify the content to render in its header.

### Out of scope of this HLD

Programmatic API for state that could be considered column-centric: width, sort direction, grouped, etc. These concerns should be covered in separate designs covering those topics specifically, allowing for discussion on both the interactive side and the API design on an individual basis.

Defining the API for how a column will specify which data field will be used for sorting (when it uses multiple fields) is also out of scope for this HLD.

## Links To Relevant Work Items and Reference Material

[Table Spec](./README.md)

[Table Declarative Columns API prototype:](https://github.com/ni/nimble/blob/325983040e886e52a100664d8fb1129dee767c2f/packages/nimble-components/src/table/tests/table.stories.ts#L23) ([Storybook](https://60e89457a987cf003efc0a5b-twewjutggo.chromatic.com/iframe.html?args=&id=table--table-story&viewMode=story))

## Implementation / Design

Column custom elements will be provided to the table as slotted elements. The slot for the column elements will be the default slot for the table, and thus no slot needs to be expressly provided by the user for a column element:

```HTML
<nimble-table>
    <nimble-table-column-text data-key="name">Name</nimble-table-column-text>
    <nimble-table-column-icon data-key="ready">Status</nimble-table-column-icon>
    ...
</nimble-table>
```

The column elements provide two purposes:

1. The elements themselves will be inserted as the header of the column in the table. In the example above the text column will have a header with the text "Name" shown in the table.
2. The columns define configuration information to the table for that column.

Each column element has an associated FAST-based custom element which will be used in each table cell for that column.

The ordering of the column elements in the markup will determine the visual ordering of the columns (top to bottom equals left to right...unless in 'rtl'). Re-ordering of columns will be done, at least at first, through the re-ordering of the column elements in the DOM.

The table API to support this could look like the following:

```TS
public Table<TableRecord> extends FoundationElement {
    ...

    /*
     * @internal
     */
    @observable
    public readonly slottedColumns: TableColumn[] = [];

    private slottedColumnsChanged(): void {
        if (this.slottedColumns.length > 0) {
            for (const tableColumn of this.slottedColumns) {
                if (this.isTableColumn(tableColumn)) {
                    // do init work
                }
            }
        }
    }
}

template:
<template>
    <div>
        ...
    </div>
    <slot ${slotted('slottedColumns')}></slot>
</template>
```

### Framework Integration

Column elements, and the associated elements used in table cells, will always be FAST-based custom elements. Framework-specific constructs/content are not supported. Standard column types (e.g. text-field, link, icon, etc) will be provided by Nimble. For non-standard column types, clients will be expected to implement a custom column type, which the rest of this document describes in detail.

### `TableCellState` interface

A table cell represents a single column for a single row. The data that a cell has access to will be a subset of the data for the entire row. An instance of a table cell will be generic to describe the subset of data it contains, where the `TCellRecord` type is a superset of the type represented by [`TableRecord`](https://github.com/ni/nimble/blob/3e4b8d3dd59431d1671e381aa66052db57bc475c/packages/nimble-components/src/table/types.ts#L24):

```TS
interface TableCellState<TCellRecord extends TableRecord, TColumnConfig> {
  data: TCellRecord;
  columnConfig: TColumnConfig;
  recordId: string;
}
```

This interface could possibly be expanded in the future to communicate relevant table state to the cell template, such as whether or not the row is selected.

### Configuration via the `TableColumn<>` base class

This abstract class is what a column web component (i.e. a slotted column element) must extend. The attributes added to the `TableColumn` class are intended to be options configurable by client users.

Column authors have additional configuration options to maintain that are configured via the `ColumnInternalsOptions` constructor parameter and the `TableColumn.columnInternals` reference.

```TS
abstract class TableColumn<TColumnConfig = {}> {
    // An optional ID to associated with the column.
    @attr({ attribute: 'column-id' })
    columnId?: string;

    // The name of the slot containing the action menu for this column, or `undefined` to indicate
    // that the column does not have an action menu.
    // Note: Multiple columns can specify the same slot.
    @attr({ attribute: 'action-menu-slot'})
    actionMenuSlot?: string;

    // The label to associated with the column's action menu for accessibility purposes.
    @attr({ attribute: 'action-menu-label' })
    actionMenuLabel?: string;

    // The index for sorting the column. When multiple columns are sorted,
    // they will be sorted from lowest index to highest index.
    @attr({ attribute: 'sort-index', converter: nullableNumberConverter })
    public sortIndex?: number | null;

    // The direction the column is sorted.
    @attr({ attribute: 'sort-direction' })
    public sortDirection: TableColumnSortDirection = TableColumnSortDirection.none;

    // @internal Configuration settings for column plugin authors
    public readonly columnInternals: ColumnInternals<TColumnConfig>;

    public constructor(options: ColumnInternalsOptions) {
        super();
        this.columnInternals = new ColumnInternals(options);
    }
}
```

_Note: The `TableColumn` class may be updated to support other features not covered in this HLD such as grouping._

### Column author internal configuration

Column authors have a required `ColumnInternalsOptions` constructor parameter argument to define for static configuration and a `columnInternals` object that can be manipulated for dynamic configuration at runtime.

```TS
export interface ColumnInternalsOptions {
    // The tag (element name) of the custom element that renders the cell content for the column.
    // Should derive from TableCellView<TCellRecord, TColumnConfig>.
    readonly cellViewTag: string;

    // The names of the fields that should be present in TCellRecord.
    // This array is parallel with the field names specified by `dataRecordFieldNames`.
    readonly cellRecordFieldNames: readonly TableFieldName[];
}
```

```TS
export class ColumnInternals<TColumnConfig> {
    // The relevant, static configuration a column requires its cell view to have access to.
    @observable
    public columnConfig?: TColumnConfig;

    // The names of the fields from the row's record that correlate to the data that will be in TCellRecord.
    // This array is parallel with the field names specified by `cellRecordFieldNames`.
    @observable
    public dataRecordFieldNames: readonly (TableFieldName | undefined)[] = [];

    // The name of the data field that will be used for operations on the table, such as sorting and grouping.
    @observable
    public operandDataRecordFieldName?: TableFieldName;

    // The operation to use when sorting the table by this column.
    @observable
    public sortOperation: TableColumnSortOperation;

```

### The `TableCellView<>` base class

Requiring column plugins to create custom elements for use in the table cells has several implications:

-   The elements encapsulate any state needed by the cell
-   The cell element templates can use `ref` to get references to view elements from their templates, for use in their element code
-   Simplifies the API needed to respond to events from the table. One example is `TableCellView.focusedRecycleCallback()` which will be called before a row is recycled during a virtualized scroll, giving column plugins the opportunity to commit changes and blur the control in the cell.

```TS
abstract class TableCellView<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableCellState<TCellRecord, TColumnConfig> {
    @observable
    public cellRecord!: TCellRecord;

    @observable
    public columnConfig!: TColumnConfig;

    /**
     * Called if an element inside this cell element has focus, and this row/cell is being recycled.
     * Expected implementation is to commit changes as needed, and blur the focusable element (or close
     * the menu/popup/etc).
     */
    public focusedRecycleCallback(): void {}
}
```

### Example columns

Given the above classes, a series of column types to handle basic use cases can be written within Nimble.

#### Simple text field

For example, the `TableColumn` implementation we could create for rendering data as a read-only `NimbleTextField` could look like this:

```TS
type TableColumnTextCellRecord = TableStringField<'value'>;
type TableColumnTextColumnConfig = { placeholder: string };

public class TableColumnText extends TableColumn<TableColumnTextCellRecord, TableColumnTextColumnConfig> {
    ...

    @attr
    public valueKey: string;

    @attr
    public placeholder: string;

    public valueKeyChanged(): void {
        this.columnInternals.dataRecordFieldNames = [this.valueKey];
    }

    public placeholderChanged(): void {
        this.columnInternals.columnConfig = { placeholder: this.placeholder };
    }

    constructor() {
        super({
            cellViewTag: 'nimble-table-cell-view-text',
            cellRecordFieldNames: ['value']
        })
    }
}
```

In the above example, the column author is responsible for tracking changes to custom properties they add to the public api of the column, such as `valueKey` and `placeholder`, and notifying the table of those changes via the `this.columnInternals` reference.

The corresponding cell element implementation would look like this:

```TS
class TextCellView extends TableCellView<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public override cellRecord!: TableColumnTextCellRecord;

    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.value === 'string'
            ? this.cellRecord.value
            : this.columnConfig.placeholder;
    }

    public textField!: TextField;
}

const textCellView = TextCellView.compose({
    baseName: 'table-cell-view-text',
    template: html<TextCellView>`
        <nimble-text-field
            ${ref('textField')}
            readonly="true"
            value="${x => x.cellRecord.value}"
            placeholder="${x => x.columnConfig.placeholder}"
        >
        </nimble-text-field>`,
    styles: /* styling */
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
```

#### Accessing multiple data record fields

Below demonstrates how column elements can access multiple fields from the row's record to use in its rendering:

```TS
type TableColumnNumberWithUnitCellData = NumberField<'value'> & TableStringField<'units'>;

public class TableColumnNumberWithUnit extends TableColumn {
    ...
    @attr
    public valueKey: string;

    @attr
    public unitKey: string;


    public valueKeyChanged() { this.updateDataRecordFieldNames(); }
    public unitKeyChanged() { this.updateDataRecordFieldNames(); }

    private updateDataRecordFieldNames(): void {
        this.columnInternals.dataRecordFieldNames = [this.valueKey, this.unitKey];
    }

    constructor() {
        super({
            cellViewTag: 'nimble-table-cell-view-number-with-unit',
            cellRecordFieldNames: ['value', 'units']
        })
    }
}

class NumberWithUnitCellView extends TableCellView<TableColumnNumberWithUnitCellData> {
    public get formattedValue(): string {
        return `${this.cellRecord.value.toString()} ${this.cellRecord.units}`;
    }
}
const numberWithUnitCellView = NumberWithUnitCellView.compose({
    baseName: 'table-cell-view-number-with-unit',
    template: html<NumberWithUnitCellView>`
        <nimble-text-field
            readonly="true"
            value="${x => x.formattedValue}"
        >
        </nimble-text-field>`,
    styles: /* styling */
});
```

#### Exposing cell view events externally

Because the cell view is not a descendant of the column element, we must add special support for the column to handle events that originate in the cells. A column will define a `delegatedEvents` property which is an array of event names that should be delegated. As this is a static property, it will be part of the `ColumnInternalsOptions` passed to the base column constructor.

```TS
export interface ColumnInternalsOptions {
    ...
    readonly delegatedEvents: readonly string[];
    ...
}

export class ColumnInternals<TColumnConfig> {
    ...
    public readonly delegatedEvents: readonly string[];
    ...
    public constructor(options: ColumnInternalsOptions) {
        this.delegatedEvents = options.delegatedEvents;
        ...
    }
}

AnchorTableColumn extends TableColumn {
    constructor() {
        super({
            delegatedEvents: ['click'],
            ...
        });
    }
    ...
}
```

Upon connecting a cell view to the DOM, we will attach an event listener for each event type in `columnInternals.delegatedEvents`. The handler will wrap the original event in a new `CustomEvent` and dispatch that to the column.

```TS
this.addEventListener(delegatedEventName, event => {
    this.column.dispatchEvent(new CustomEvent('delegated-event', {
        details: {
            originalEvent: event
        }
    }));
});
```

The `CustomEvent`'s details will be of type `DelegatedEventEventDetails`:

```TS
export interface DelegatedEventEventDetails {
    originalEvent: Event;
}
```

A client may register a listener for the `delegated-event` event on a table column. This listener will have access to the full original event, including the originating cell view via `event.target`. The cell view can expose anything necessary from its public API.

```TS
class AnchorColumnDirective {
  @HostListener('delegated-event', ['$event.details.originalEvent'])
  onDelegatedEvent(originalEvent: CustomEvent<DelegatedEventEventDetails>) {
      if (originalEvent.type !== 'click') {
          return;
      }
      if ((originalEvent as MouseEvent).button !== 0) {
          return;
      }
      const cellView = originalEvent.target as TableColumnAnchorCellView;
      this.doSomething(cellView.anchor.href);
      originalEvent.preventDefault();
  }
}
```

### Header Content

Clients should be allowed to use arbitrary content for the display part of a header. This is accomplished through slotting the desired content in the default slot of a `TableColumn` element. The details of how this is implemented will not be captured here, just the proposed API.

```HTML
<nimble-table>
    <nimble-table-column-text>
        <!-- uses icon for column header -->
        <nimble-icon-x></nimble-icon-x>
    <nimble-table-column-text>
</nimble-table>
```

### Validation

A column's internals includes a `validConfiguration` flag that should be set `false` when the column has invalid configuration. There is a base `ColumnValidator` type that manages the state of that flag. It also manages a set of flags that represent specific ways that the column's configuration can be invalid. These validity flags can be returned as an object.

```TS
export class ColumnValidator<ValidityFlagNames extends readonly string[]> {
    protected configValidity: ObjectFromList<ValidityFlagNames>;

    public isValid(): boolean {
        return Object.values(this.configValidity).every(x => !x);
    }

    public getValidity(): ValidityObject {
        return {
            ...this.configValidity
        };
    }

    protected setConditionValue(
        name: ValidityFlagNames extends readonly (infer U)[] ? U : never,
        isInvalid: boolean
    ): void {
        this.configValidity[name] = isInvalid;
        this.updateColumnInternalsFlag();
    }
```

Each column type may define its own `ColumnValidator` type to handle the specifics of that column type's configuration:

```TS
const configValidity = [
    'hasMultipleDefaultMappings',
    'hasUnsupportedMappingTypes',
    ...
] as const;

class TableColumnIconValidator extends ColumnValidator<typeof configValidity> {
    public constructor(columnInternals: ColumnInternals<unknown>) {
        super(columnInternals, configValidity);
    }

    public validateNoMultipleDefaultMappings(mappings: Mapping[]): void {
        ...
        this.setConditionValue('hasMultipleDefaultMappings', foundMultiple);
    }

    public validateNoUnsupportedMappingTypes(mappings: Mapping[]): void {
        ...
        this.setConditionValue('hasUnsupportedMappingTypes', foundUnsupported);
    }
    ...
}
```

The column type will respond to changes in properties by calling the validator's validation functions:

```TS
private mappingsChanged(): void {
    this.validator.validateNoMultipleDefaultMappings(this.mappings);
    this.validator.validateNoUnsupportedMappingTypes(this.mappings);
}
```

The table's validity object has a property to represent the validity of all of its columns:

```TS
export class TableValidator<TData extends TableRecord> {
    private invalidColumnConfiguration: boolean; // true if one or more invalid columns
    public isValid(): boolean {
        ...
        && !this.invalidColumnConfiguration
        ...
    }

    public validateColumns(columns: TableColumn[]): boolean {
        this.invalidColumnConfiguration = columns.some(x => !x.checkValidity());
        return !this.invalidColumnConfiguration;
    }
}
```

The `validateColumns()` function is one of the multiple validation functions called from `validate()`, which in turn is called when a queued update is executed.

## Alternative Implementations / Designs

### Programmatic API

A programmatic API was also considered either in place of, or along side the proposed declarative API. Since declaring what columns to show is an aspect of view configuration, it makes sense to accomplish this declaratively when possible. Offering a programmatic API alongside the declarative one, while possible, does introduce complexity in the implementation that would be nice to avoid, at least initially, if possible.

## Open Issues

-   The current design doesn't offer any strict templating feedback (in Angular) for a particular `TableColumn` implementation. So, if a user provides a dataKey to a property of an `TableColumn` that wants the value for that dataKey to be a `DateTime` (i.e. its cell view implementation expects a `DateTime`), but the value in the actual table data for that key is a string, the user will be unaware of that mismatch at compile time.

    It is unclear how we could provide such feedback, but it would be extremely nice if possible.

    (_RESOLVED_) - While we recognize that offering strict templating feedback in something like an Angular environment would be nice, it's not immediately obvious how we would accomplish this, and isn't critical, so, for now, we will not bother with this.
