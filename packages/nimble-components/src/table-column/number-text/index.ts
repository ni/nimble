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
import { NumberTextFormat } from './types';
import type { NumberFormatter } from './models/number-formatter';
import { IntegerFormatter } from './models/integer-formatter';
import { DefaultFormatter } from './models/default-formatter';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: NumberFormatter;
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

    private updateColumnConfig(): void {
        const columnConfig: TableColumnNumberTextColumnConfig = {
            formatter: this.createFormatter()
        };
        this.columnInternals.columnConfig = columnConfig;
    }

    private createFormatter(): NumberFormatter {
        switch (this.format) {
            case NumberTextFormat.integer:
                return new IntegerFormatter();
            default:
                return new DefaultFormatter();
        }
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
