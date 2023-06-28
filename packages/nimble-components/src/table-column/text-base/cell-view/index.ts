import { observable, volatile } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableCellRecord } from '../../base/types';

/**
 * The cell view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextCellViewBase<
    TCellRecord extends TableCellRecord = TableCellRecord,
    TColumnConfig = unknown
> extends TableCellView<TCellRecord, TColumnConfig> {
    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    /** @internal */
    public textSpan!: HTMLElement;

    /**
     * Text to render in the cell when it contains a valid value (i.e. when shouldUsePlaceholder is false).
     */
    @observable
    public text = '';

    /**
     * Text to render in the cell when it contains an invalid value (i.e. when shouldUsePlaceholder is true).
     */
    @observable
    public placeholder = '';

    /**
     * Returns whether to display the placeholder value or the text value
     */
    @observable
    public shouldUsePlaceholder = false;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder ? this.placeholder : this.text;
    }
}
