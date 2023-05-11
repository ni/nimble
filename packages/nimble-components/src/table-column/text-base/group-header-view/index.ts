import { observable, volatile } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';

/**
 * The abstract base class for custom elements used to render a group row header for a group representing rows
 * grouped by a TableColumnTextBase column.
 */
export abstract class TableColumnTextGroupHeaderViewBase<
    TGroupValue = TableFieldValue,
    TColumnConfig = unknown
> extends TableGroupHeaderView<TGroupValue, TColumnConfig> {
    /** @internal */
    public textSpan!: HTMLElement;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

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

    /** @internal */
    public updateTitleOverflow(): void {
        this.isValidContentAndHasOverflow = this.textSpan.offsetWidth < this.textSpan.scrollWidth;
    }

    /** @internal */
    public clearTitleOverflow(): void {
        this.isValidContentAndHasOverflow = false;
    }
}
