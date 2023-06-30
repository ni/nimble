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
    @observable
    public hasOverflow = false;

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
    public shouldUsePlaceholder = true;

    @volatile
    public get content(): string {
        return this.shouldUsePlaceholder ? this.placeholder : this.text;
    }
}
