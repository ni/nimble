import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnNumberTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text-group-header': TableColumnNumberTextGroupHeaderView;
    }
}
/**
 * The custom element used to render a group row header for a group representing rows
 * grouped by a TableColumnNumberText column.
 */
export class TableColumnNumberTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnNumberTextColumnConfig
> {
    public override get text(): string {
        return this.groupHeaderValue?.toString() ?? '';
    }

    public override get placeholder(): string {
        return this.columnConfig?.placeholder ?? '';
    }

    public override get shouldUsePlaceholder(): boolean {
        return typeof this.groupHeaderValue !== 'number';
    }
}

const tableColumnNumberTextGroupHeaderView = TableColumnNumberTextGroupHeaderView.compose({
    baseName: 'table-column-number-text-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnNumberTextGroupHeaderView());
export const tableColumnNumberTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnNumberTextGroupHeaderView
);
