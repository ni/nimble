import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';
import type { TableColumnNumberTextColumnConfig } from '..';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-group-header': TableColumnNumberTextGroupHeaderView;
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
        const value = this.groupHeaderValue;
        if (!this.columnConfig || typeof value !== 'number') {
            this.text = '';
        } else {
            this.text = this.columnConfig.formatter.format(value);
        }
    }
}

const tableColumnNumberTextGroupHeaderView = TableColumnNumberTextGroupHeaderView.compose({
    baseName: 'table-column-number-text-group-header-view',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnNumberTextGroupHeaderView());
export const tableColumnNumberTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnNumberTextGroupHeaderView
);
