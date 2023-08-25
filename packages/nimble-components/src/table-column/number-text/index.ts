import { DesignSystem } from '@microsoft/fast-foundation';
import { attr } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation } from '../base/types';
import { tableColumnNumberTextGroupHeaderTag } from './group-header-view';
import { tableColumnNumberTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { NumberTextAlignment, NumberTextFormat } from './types';
import type { NumberFormatter } from './models/number-formatter';
import { RoundToIntegerFormatter } from './models/round-to-integer-formatter';
import { DefaultFormatter } from './models/default-formatter';
import { TextCellViewBaseAlignment } from '../text-base/cell-view/types';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: NumberFormatter;
    alignment: TextCellViewBaseAlignment;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text': TableColumnNumberText;
    }
}

/**
 * The table column for displaying numbers as text.
 */
export class TableColumnNumberText extends TableColumnTextBase {
    @attr
    public format: NumberTextFormat;

    @attr
    public alignment: NumberTextAlignment;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateColumnConfig();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions {
        return {
            cellRecordFieldNames: ['value'],
            cellViewTag: tableColumnNumberTextCellViewTag,
            groupHeaderViewTag: tableColumnNumberTextGroupHeaderTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic
        };
    }

    private formatChanged(): void {
        this.updateColumnConfig();
    }

    private alignmentChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        const columnConfig: TableColumnNumberTextColumnConfig = {
            formatter: this.createFormatter(),
            alignment: this.determineCellContentAlignment()
        };
        this.columnInternals.columnConfig = columnConfig;
    }

    private createFormatter(): NumberFormatter {
        switch (this.format) {
            case NumberTextFormat.roundToInteger:
                return new RoundToIntegerFormatter();
            default:
                return new DefaultFormatter();
        }
    }

    private determineCellContentAlignment(): TextCellViewBaseAlignment {
        if (this.alignment === NumberTextAlignment.left) {
            return TextCellViewBaseAlignment.left;
        }

        if (this.alignment === NumberTextAlignment.right) {
            return TextCellViewBaseAlignment.right;
        }

        // Look at format to determine the default alignment
        if (this.format === NumberTextFormat.roundToInteger) {
            return TextCellViewBaseAlignment.right;
        }
        return TextCellViewBaseAlignment.left;
    }
}

const nimbleTableColumnNumberText = TableColumnNumberText.compose({
    baseName: 'table-column-number-text',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnNumberText());
export const tableColumnNumberTextTag = DesignSystem.tagFor(
    TableColumnNumberText
);
