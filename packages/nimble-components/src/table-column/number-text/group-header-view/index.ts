import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnNumberTextColumnConfig } from '..';

const baseName = 'table-column-number-text-group-header';
export const tableColumnNumberTextGroupHeaderTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tableColumnNumberTextGroupHeaderTag]: TableColumnNumberTextGroupHeaderView;
    }
}
/**
 * The group header view for displaying number fields as text.
 */
export class TableColumnNumberTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnNumberTextColumnConfig
> {
    private columnConfigChanged(): void {
        this.updateText();
    }

    private groupHeaderValueChanged(): void {
        this.updateText();
    }

    private updateText(): void {
        this.text = this.columnConfig?.formatter?.formatValue(this.groupHeaderValue)
            ?? '';
    }
}

const tableColumnNumberTextGroupHeaderView = TableColumnNumberTextGroupHeaderView.compose({
    baseName,
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(tableColumnNumberTextGroupHeaderView());
