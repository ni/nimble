import { observable, volatile } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';
import type { TableColumnWithPlaceholderColumnConfig } from '../../base/types';

/**
 * The group header view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextGroupHeaderViewBase<
    TGroupValue = TableFieldValue,
    TColumnConfig = TableColumnWithPlaceholderColumnConfig
> extends TableGroupHeaderView<TGroupValue, TColumnConfig> {
    /** @internal */
    public textSpan!: HTMLElement;

    /** @internal */
    @observable
    public hasOverflow = false;

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

    /** @internal */
    public updateTitleOverflow(): void {
        this.hasOverflow = this.textSpan.offsetWidth < this.textSpan.scrollWidth;
    }

    /** @internal */
    public clearTitleOverflow(): void {
        this.hasOverflow = false;
    }
}
