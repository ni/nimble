import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';

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
     */
    @observable
    public text = 'No value'; // mkreis TODO: Localize

    /**
     * Sets `this.text` to the default placeholder if `groupHeaderValue` is `null` or `undefined`
     * @param groupHeaderValue The value for the group
     * @returns `true` if `this.text` was set to the default placeholder, `false` otherwise.
     */
    protected applyPlaceholderTextIfNeeded(groupHeaderValue: TableFieldValue): boolean {
        if (groupHeaderValue === null || groupHeaderValue === undefined) {
            // mkreis TODO: Localize
            this.text = 'No value';
            return true;
        }
        return false;
    }
}
