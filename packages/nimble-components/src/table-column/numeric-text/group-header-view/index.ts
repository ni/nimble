import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnNumericTextColumnConfig } from '..';
import type { TableNumberFieldValue } from '../../../table/types';
import { TableColumnTextGroupHeaderViewBase } from '../../text-base/group-header-view';
import { template } from '../../text-base/group-header-view/template';
import { styles } from '../../text-base/group-header-view/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-numeric-text-group-header': TableColumnNumericTextGroupHeaderView;
    }
}
/**
 * The custom element used to render a group row header for a group representing rows
 * grouped by a TableColumnNumericText column.
 */
export class TableColumnNumericTextGroupHeaderView extends TableColumnTextGroupHeaderViewBase<
TableNumberFieldValue,
TableColumnNumericTextColumnConfig
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

const tableColumnNumericTextGroupHeaderView = TableColumnNumericTextGroupHeaderView.compose({
    baseName: 'table-column-numeric-text-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnNumericTextGroupHeaderView());
export const tableColumnNumericTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnNumericTextGroupHeaderView
);
