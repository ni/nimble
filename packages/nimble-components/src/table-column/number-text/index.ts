import { DesignSystem } from '@microsoft/fast-foundation';
import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { tableColumnNumberTextGroupHeaderTag } from './group-header-view';
import { tableColumnNumberTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { NumberTextFormat } from './types';
import type { NumberFormatter } from './models/number-formatter';
import { RoundToIntegerFormatter } from './models/round-to-integer-formatter';
import { DefaultFormatter } from './models/default-formatter';
import { DecimalFormatter } from './models/decimal-formatter';
import { TableColumnNumberTextValidator } from './models/table-column-number-text-validitor';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: NumberFormatter;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-number-text': TableColumnNumberText;
    }
}

const defaultDecimalDigits = 2;

/**
 * The table column for displaying numbers as text.
 */
export class TableColumnNumberText extends TableColumnTextBase {
    /** @internal */
    public validator = new TableColumnNumberTextValidator(this.columnInternals);

    @attr
    public format: NumberTextFormat;

    @attr({ attribute: 'decimal-digits', converter: nullableNumberConverter })
    public decimalDigits?: number;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.updateColumnConfig();
    }

    public override get validity(): TableColumnValidity {
        return this.validator.getValidity();
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

    private decimalDigitsChanged(): void {
        // decimalDigits is only used by the 'decimal' format option. Only update the
        // column configuration if that is the current format option.
        if (this.format === NumberTextFormat.decimal) {
            this.updateColumnConfig();
        }
    }

    private updateColumnConfig(): void {
        this.validator.validateDecimalDigits(this.format, this.decimalDigits);

        if (this.validator.isValid()) {
            const columnConfig: TableColumnNumberTextColumnConfig = {
                formatter: this.createFormatter()
            };
            this.columnInternals.columnConfig = columnConfig;
        } else {
            this.columnInternals.columnConfig = undefined;
        }
    }

    private createFormatter(): NumberFormatter {
        switch (this.format) {
            case NumberTextFormat.roundToInteger:
                return new RoundToIntegerFormatter();
            case NumberTextFormat.decimal:
                return new DecimalFormatter(
                    this.decimalDigits ?? defaultDecimalDigits
                );
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
