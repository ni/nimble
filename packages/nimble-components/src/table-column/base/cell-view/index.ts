import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { TableColumn } from '..';
import type {
    DelegatedEventEventDetails,
    TableCellRecord,
    TableCellState
} from '../types';

/**
 * Base class for table cell views, which are used within the nimble-table-cell.
 * Each TableColumn type has a corresponding TableCellView type (linked via TableColumn.cellViewTag).
 */
export abstract class TableCellView<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
>
    extends FoundationElement
    implements TableCellState<TCellRecord, TColumnConfig> {
    @observable
    public cellRecord!: TCellRecord;

    @observable
    public columnConfig!: TColumnConfig;

    @observable
    public column?: TableColumn<TColumnConfig>;

    private delegatedEvents: readonly string[] = [];

    /**
     * Called if an element inside this cell view has focus, and this row/cell is being recycled.
     * Expected implementation is to commit changes as needed, and blur the focusable element (or close
     * the menu/popup/etc).
     */
    public focusedRecycleCallback(): void {}

    public columnChanged(): void {
        for (const eventName of this.delegatedEvents) {
            this.removeEventListener(eventName, this.delgatedEventHandler);
        }
        this.delegatedEvents = [];
        this.delgatedEventHandler = () => {};

        if (!this.column) {
            return;
        }
        this.delegatedEvents = this.column.columnInternals.delegatedEvents;
        this.delgatedEventHandler = (event: Event) => {
            this.column?.dispatchEvent(
                new CustomEvent<DelegatedEventEventDetails>(
                    'delegated-event',
                    { detail: { originalEvent: event } }
                )
            );
        };

        for (const delegatedEvent of this.delegatedEvents) {
            this.addEventListener(delegatedEvent, this.delgatedEventHandler);
        }
    }

    private delgatedEventHandler: (event: Event) => void = () => {};
}
