import { observable } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import type { TableCellRecord, TableCellState } from './types';

/**
 * Base class for table cell elements.
 * There is a 1:1 mapping between custom TableColumn and TableCellView implementations, via
 * TableColumn.cellViewTag.
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

    /**
     * Called if an element inside this cell element has focus, and this row/cell is being recycled.
     * Expected implementation is to commit changes as needed, and blur the focusable element (or close
     * the menu/popup/etc).
     */
    public focusedRecycleCallback(): void {}
}
