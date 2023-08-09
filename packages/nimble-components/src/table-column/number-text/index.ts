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
import { NumberTextFormat, defaultNumberOfDigits } from './types';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: Intl.NumberFormat;
    exponentialFormatter?: Intl.NumberFormat;
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
        this.columnInternals.columnConfig = this.createFormatterConfig();
    }

    private createFormatterConfig(): TableColumnNumberTextColumnConfig {
        let exponentialFormatter: Intl.NumberFormat | undefined;
        let options: Intl.NumberFormatOptions;
        switch (this.format) {
            case NumberTextFormat.integer:
                options = { maximumFractionDigits: 0, useGrouping: true };
                break;
            default:
                options = {
                    maximumSignificantDigits: defaultNumberOfDigits,
                    useGrouping: true
                };
                exponentialFormatter = new Intl.NumberFormat(undefined, {
                    maximumSignificantDigits: defaultNumberOfDigits,
                    notation: 'scientific'
                });
                break;
        }
        const formatter = new Intl.NumberFormat(undefined, options);
        return {
            formatter,
            exponentialFormatter
        };
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
