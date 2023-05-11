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

    /** Returns the text to render in the cell when it contains a valid value */
    public abstract get text(): string;

    /** Returns the text to render in the cell when it contains an invalid value */
    public abstract get placeholder(): string;

    /** Return whether to display the placeholder value or the text value */
    public abstract get shouldUsePlaceholder(): boolean;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder ? this.placeholder : this.text;
    }
}
