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

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: Intl.NumberFormat;
    useDefaultFormatting: boolean;
    defaultScientificFormatter?: Intl.NumberFormat;
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
        let defaultScientificFormatter: Intl.NumberFormat | undefined;
        let options: Intl.NumberFormatOptions;
        switch (this.format) {
            case NumberTextFormat.integer:
                options = { maximumFractionDigits: 0, useGrouping: false };
                break;
            default:
                options = {
                    maximumSignificantDigits: 16,
                    maximumFractionDigits: 16,
                    useGrouping: false
                };
                defaultScientificFormatter = new Intl.NumberFormat(undefined, {
                    maximumSignificantDigits: 16,
                    notation: 'scientific'
                });
                break;
        }
        const formatter = new Intl.NumberFormat(undefined, options);
        return {
            formatter,
            useDefaultFormatting: this.format === NumberTextFormat.default,
            defaultScientificFormatter
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
