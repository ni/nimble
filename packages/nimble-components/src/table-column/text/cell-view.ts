import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import { TableCellView } from '../base/cell-view';
import { cellViewStyles } from './styles';
import { cellViewTemplate } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell-view-text': TextCellView;
    }
}

/**
 * A cell view for displaying strings
 */
export class TextCellView extends TableCellView<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public override cellRecord!: TableColumnTextCellRecord;

    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    @observable
    public isHoveredWithOverflow = false;

    public textSpan!: HTMLElement;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.value === 'string'
            ? this.cellRecord.value
            : this.columnConfig.placeholder;
    }
}

const textCellElement = TextCellView.compose({
    baseName: 'table-cell-view-text',
    template: cellViewTemplate,
    styles: cellViewStyles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellElement());
export const textCellElementTag = DesignSystem.tagFor(TextCellView);
