import { observable } from '@microsoft/fast-element';
import { TableGroupHeaderView } from '../../base/group-header-view';
import type { TableFieldValue } from '../../../table/types';
import { tableGroupRowEmptyPlaceholder, tableGroupRowNoValuePlaceholder } from '../../../label-provider/table/label-tokens';

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

    public constructor() {
        super();

        // Initialize the text to the noValuePlaceholder because if the group row never
        // has a groupHeaderValue defined on it, the change handlers in the implementation
        // may never be called but the text should still be correct.
        this.text = this.noValuePlaceholder;
    }

    protected get noValuePlaceholder(): string {
        return tableGroupRowNoValuePlaceholder.getValueFor(this);
    }

    /**
     * Sets `this.text` to the default placeholder if `groupHeaderValue` is `null` or `undefined`
     * @param groupHeaderValue The value for the group
     * @returns `true` if `this.text` was set to the default placeholder, `false` otherwise.
     */
    protected applyPlaceholderTextIfNeeded(groupHeaderValue: TableFieldValue, checkForEmpty = false): boolean {
        if (groupHeaderValue === null || groupHeaderValue === undefined) {
            this.text = this.noValuePlaceholder;
            return true;
        }
        if (checkForEmpty && groupHeaderValue === '') {
            this.text = tableGroupRowEmptyPlaceholder.getValueFor(this);
            return true;
        }
        return false;
    }
}
