import { observable, volatile } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import type { TableColumnTextCellRecord, TableColumnTextColumnConfig } from '.';
import { BaseCellElement } from '../base/cell-element';
import { cellStyles } from './styles';
import { cellTemplate } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-cell-element-text': TextCellElement;
    }
}

/**
 * A cell element for text content
 */
export class TextCellElement extends BaseCellElement<
TableColumnTextCellRecord,
TableColumnTextColumnConfig
> {
    @observable
    public override cellRecord!: TableColumnTextCellRecord;

    @observable
    public override columnConfig!: TableColumnTextColumnConfig;

    @observable
    public isHoveredWithOverflow = false;

    @volatile
    public get content(): string {
        return typeof this.cellRecord.value === 'string'
            ? this.cellRecord.value
            : this.columnConfig.placeholder;
    }

    public textSpan!: HTMLElement;
}

const textCellElement = TextCellElement.compose({
    baseName: 'table-cell-element-text',
    template: cellTemplate,
    styles: cellStyles
});
DesignSystem.getOrCreate().withPrefix('nimble').register(textCellElement());
export const textCellElementTag = DesignSystem.tagFor(TextCellElement);
