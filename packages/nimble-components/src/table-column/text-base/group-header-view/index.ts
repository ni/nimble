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
    public text = '';
}
