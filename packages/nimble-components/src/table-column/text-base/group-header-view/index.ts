import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';
import {
    tableGroupRowEmptyPlaceholderLabel,
    tableGroupRowNoValuePlaceholderLabel
} from '../../../label-provider/table/label-tokens';

/**
 * The group header view base class for displaying fields of any type as text.
 */
export abstract class TableColumnTextGroupHeaderViewBase<
    TGroupValue = TableFieldValue,
    TColumnConfig = unknown
> extends TableGroupHeaderView<TGroupValue, TColumnConfig> {
    /** @internal */
    @observable
    public hasOverflow = false;

    /**
     * Text to render in the cell.
     *
     * The value is initialized to `tableGroupRowNoValuePlaceholder` because if the group
     * row never has a value defined on it, the change handlers may never get called but
     * the text needs to be correct.
     */
    @observable
    public text = tableGroupRowNoValuePlaceholderLabel.getValueFor(this);

    /**
     * Sets `this.text` to the appropriate placeholder if `groupHeaderValue` warrants it.
     * @param groupHeaderValue The value for the group
     * @returns `true` if `this.text` was set to a placeholder, `false` otherwise.
     */
    protected applyPlaceholderTextIfNeeded(
        groupHeaderValue: TableFieldValue
    ): boolean {
        if (groupHeaderValue === null || groupHeaderValue === undefined) {
            this.text = tableGroupRowNoValuePlaceholderLabel.getValueFor(this);
            return true;
        }
        if (groupHeaderValue === '') {
            this.text = tableGroupRowEmptyPlaceholderLabel.getValueFor(this);
            return true;
        }
        return false;
    }
}
