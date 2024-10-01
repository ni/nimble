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
    public cellRecord?: TCellRecord;

    @observable
    public columnConfig?: TColumnConfig;

    @observable
    public column?: TableColumn<TColumnConfig>;

    @observable
    public recordId?: string;

    /**
     * The child elements in this cell view that should be able to be reached via Tab/ Shift-Tab,
     * if any.
     */
    @observable
    public tabbableChildren: Element[] = [];

    private delegatedEvents: readonly string[] = [];

    public columnChanged(): void {
        for (const eventName of this.delegatedEvents) {
            this.removeEventListener(eventName, this.delegatedEventHandler);
        }
        this.delegatedEvents = [];
        this.delegatedEventHandler = () => {};

        if (!this.column) {
            return;
        }
        this.delegatedEvents = this.column.columnInternals.delegatedEvents;
        this.delegatedEventHandler = (event: Event) => {
            if (this.recordId) {
                this.column?.dispatchEvent(
                    new CustomEvent<DelegatedEventEventDetails>(
                        'delegated-event',
                        {
                            detail: {
                                originalEvent: event,
                                recordId: this.recordId
                            }
                        }
                    )
                );
            }
        };

        for (const delegatedEvent of this.delegatedEvents) {
            this.addEventListener(delegatedEvent, this.delegatedEventHandler);
        }
    }

    private delegatedEventHandler: (event: Event) => void = () => {};

    private tabbableChildrenChanged(): void {
        this.$emit('cell-tabbable-children-change', this);
    }
}
