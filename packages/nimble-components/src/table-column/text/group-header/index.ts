import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnTextColumnConfig } from '..';
import { TableGroupHeaderView } from '../../../table/components/group-header-view/table-group-header-view';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-group-header': TableColumnTextGroupHeaderView;
    }
}
/**
 * The custom element used to render a group row header for a group representing rows
 * gruped by a TableColumnText column.
 */
export class TableColumnTextGroupHeaderView extends TableGroupHeaderView<
string | null | undefined,
TableColumnTextColumnConfig
> {
    @observable
    public override columnConfig?: TableColumnTextColumnConfig;

    @volatile
    public get content(): string {
        return typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : this.columnConfig?.placeholder ?? '';
    }
}

const tableColumnTextGroupHeaderView = TableColumnTextGroupHeaderView.compose({
    baseName: 'table-column-text-group-header',
    template
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnTextGroupHeaderView());
export const tableColumnTextGroupHeaderTag = DesignSystem.tagFor(
    TableColumnTextGroupHeaderView
);
