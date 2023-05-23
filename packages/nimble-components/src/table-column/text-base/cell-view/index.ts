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
     * Returns the text to render in the cell when it contains a valid value (i.e. when shouldUsePlaceholder() is false).
     * If the implementation has branching code paths then it must be marked with @volatile.
     * https://www.fast.design/docs/fast-element/observables-and-state/#observable-features
     */
    public abstract get text(): string;

    /**
     * Returns the text to render in the cell when it contains an invalid value (i.e. when shouldUsePlaceholder() is true).
     * If the implementation has branching code paths then it must be marked with @volatile.
     * https://www.fast.design/docs/fast-element/observables-and-state/#observable-features
     */
    public abstract get placeholder(): string;

    /**
     * Returns whether to display the placeholder value or the text value
     * If the implementation has branching code paths then it must be marked with @volatile.
     * https://www.fast.design/docs/fast-element/observables-and-state/#observable-features
     * */
    public abstract get shouldUsePlaceholder(): boolean;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder ? this.placeholder : this.text;
    }
}
