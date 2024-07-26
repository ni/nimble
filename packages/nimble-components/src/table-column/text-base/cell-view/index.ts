import { observable } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableCellRecord } from '../../base/types';
import { TableColumnAlignment, TableFieldValue } from '../../../table/types';

export interface TableColumnTextBaseCellRecord extends TableCellRecord {
    value: TableFieldValue;
}

export interface TableColumnTextBaseColumnConfig {
    placeholder?: string;
}

/**
 * The cell view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextCellViewBase<
    TCellRecord extends
    TableColumnTextBaseCellRecord = TableColumnTextBaseCellRecord,
    TColumnConfig extends
    TableColumnTextBaseColumnConfig = TableColumnTextBaseColumnConfig
> extends TableCellView<TCellRecord, TColumnConfig> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /**
     * Text to render in the cell.
     */
    @observable
    public text = '';

    /**
     * The alignment of the text within the cell.
     */
    @observable
    public alignment: TableColumnAlignment = TableColumnAlignment.left;

    /**
     * Whether or not the text being displayed in the cell view is a placeholder.
     */
    @observable
    public isPlaceholder = false;

    protected abstract updateText(): void;

    protected columnConfigChanged(): void {
        if (!this.applyPlaceholderTextIfNeeded()) {
            this.updateText();
        }
    }

    private cellRecordChanged(): void {
        if (!this.applyPlaceholderTextIfNeeded()) {
            this.updateText();
        }
    }

    /**
     * Sets `this.text` to the appropriate placeholder if `cellValue` warrants it.
     * @returns `true` if `this.text` was set to a placeholder, `false` otherwise.
     */
    private applyPlaceholderTextIfNeeded(): boolean {
        const cellValue = this.cellRecord?.value;
        const placeholder = this.columnConfig?.placeholder;
        if (
            typeof placeholder === 'string'
            && (cellValue === null || cellValue === undefined)
        ) {
            this.text = placeholder;
            this.isPlaceholder = true;
        } else {
            this.isPlaceholder = false;
        }

        return this.isPlaceholder;
    }
}
