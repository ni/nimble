/* eslint-disable max-classes-per-file */
import { observable, volatile } from '@microsoft/fast-element';
import { TableCellView } from '../../base/cell-view';
import type { TableCellRecord } from '../../base/types';

/**
 * A cell view base class for displaying fields of any type as text.
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

    public abstract get text(): string;

    public abstract get placeholder(): string;

    public abstract get shouldUsePlaceholder(): boolean;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder ? this.placeholder : this.text;
    }
}
