import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnAnchorColumnConfig } from '..';
import { TableGroupHeaderView } from '../../base/group-header-view';
import { template } from './template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-anchor-group-header': TableColumnAnchorGroupHeaderView;
    }
}
/**
 * The custom element used to render a group row header for a group representing rows
 * grouped by a TableColumnAnchor column.
 */
export class TableColumnAnchorGroupHeaderView extends TableGroupHeaderView<
string | null | undefined,
TableColumnAnchorColumnConfig
> {
    /** @internal */
    public textSpan!: HTMLElement;

    /** @internal */
    @observable
    public isValidContentAndHasOverflow = false;

    @volatile
    public get content(): string {
        return typeof this.groupHeaderValue === 'string'
            ? this.groupHeaderValue
            : this.columnConfig?.placeholder ?? '';
    }

    public updateTitleOverflow(): void {
        this.isValidContentAndHasOverflow = this.textSpan.offsetWidth < this.textSpan.scrollWidth;
    }

    public clearTitleOverflow(): void {
        this.isValidContentAndHasOverflow = false;
    }
}

const tableColumnAnchorGroupHeaderView = TableColumnAnchorGroupHeaderView.compose({
    baseName: 'table-column-anchor-group-header',
    template,
    styles
});
DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(tableColumnAnchorGroupHeaderView());
export const tableColumnAnchorGroupHeaderTag = DesignSystem.tagFor(
    TableColumnAnchorGroupHeaderView
);
