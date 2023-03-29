import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type {
    TableColumnTextCellRecord,
    TableColumnTextColumnConfig
} from '..';
import { TableCellView } from '../../base/cell-view';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-text-cell-view': TableColumnTextCellView;
    }
}

/**
 * A cell view for displaying strings
 */
export class TableColumnTextCellView extends TableCellView<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public override cellRecord!: TableColumnTextCellRecord;

    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    /** @internal */
    @observable
    public isHoveredWithOverflow = false;

    /** @internal */
    public textSpan!: HTMLElement;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.value === 'string'
            ? this.cellRecord.value
            : this.columnConfig.placeholder;
    }
}

const textCellView = TableColumnTextCellView.compose({
    baseName: 'table-column-text-cell-view',
    template,
    styles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellView());
export const tableColumnTextCellViewTag = DesignSystem.tagFor(
    TableColumnTextCellView
);
