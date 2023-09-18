import {
    DesignSystem,
    DesignTokenSubscriber
} from '@microsoft/fast-foundation';
import { attr, nullableNumberConverter } from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from '../base/template';
import type { TableNumberField } from '../../table/types';
import { TableColumnTextBase } from '../text-base';
import { TableColumnSortOperation, TableColumnValidity } from '../base/types';
import { tableColumnNumberTextGroupHeaderTag } from './group-header-view';
import { tableColumnNumberTextCellViewTag } from './cell-view';
import type { ColumnInternalsOptions } from '../base/models/column-internals';
import { NumberTextAlignment, NumberTextFormat } from './types';
import type { NumberFormatter } from './models/number-formatter';
import { DefaultFormatter } from './models/default-formatter';
import { DecimalFormatter } from './models/decimal-formatter';
import { TableColumnNumberTextValidator } from './models/table-column-number-text-validator';
import { TextCellViewBaseAlignment } from '../text-base/cell-view/types';
import { lang } from '../../theme-provider';

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

const defaultDecimalDigits = 2;

/**
 * The table column for displaying numbers as text.
 */
export class TableColumnNumberText extends TableColumnTextBase {
    /** @internal */
    public validator = new TableColumnNumberTextValidator(this.columnInternals);

    @attr
    public format: NumberTextFormat;

    @attr
    public alignment: NumberTextAlignment;

    @attr({ attribute: 'decimal-digits', converter: nullableNumberConverter })
    public decimalDigits?: number;

    private readonly langSubscriber: DesignTokenSubscriber<typeof lang> = {
        handleChange: () => {
            this.updateColumnConfig();
        }
    };

    public override connectedCallback(): void {
        super.connectedCallback();
        lang.subscribe(this.langSubscriber, this);
        this.updateColumnConfig();
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        lang.unsubscribe(this.langSubscriber, this);
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

    private alignmentChanged(): void {
        this.updateColumnConfig();
    }

    private decimalDigitsChanged(): void {
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.validator.validateDecimalDigits(this.format, this.decimalDigits);

        if (this.validator.isValid()) {
            const columnConfig: TableColumnNumberTextColumnConfig = {
                formatter: this.createFormatter(),
                alignment: this.determineCellContentAlignment()
            };
            this.columnInternals.columnConfig = columnConfig;
        } else {
            this.columnInternals.columnConfig = undefined;
        }
    }

    private createFormatter(): NumberFormatter {
        switch (this.format) {
            case NumberTextFormat.decimal:
                return new DecimalFormatter(
                    lang.getValueFor(this),
                    this.decimalDigits ?? defaultDecimalDigits
                );
            default:
                return new DefaultFormatter(lang.getValueFor(this));
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
        if (this.format === NumberTextFormat.decimal) {
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
