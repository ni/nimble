import {
    DesignSystem,
    DesignTokenSubscriber
} from '@microsoft/fast-foundation';
import {
    attr,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable
} from '@microsoft/fast-element';
import { styles } from '../base/styles';
import { template } from './template';
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
import { Unit } from '../../unit/base/unit';
import { waitUntilCustomElementsDefinedAsync } from '../../utilities/wait-until-custom-elements-defined-async';
import { EmptyUnitScale } from './models/empty-unit-scale';

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

    @attr({
        attribute: 'decimal-maximum-digits',
        converter: nullableNumberConverter
    })
    public decimalMaximumDigits?: number;

    /** @internal */
    @observable
    public unitElements?: Element[];

    private unit?: Unit;

    private unitNotifier?: Notifier;

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

    /**
     * @internal
     *
     * Respond to any change in the unitScale's observable properties by updating the column config
     */
    public handleChange(): void {
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

    private observeUnit(): void {
        if (this.unitNotifier) {
            this.unitNotifier.unsubscribe(this);
            this.unitNotifier = undefined;
        }

        if (this.unit) {
            const notifier = Observable.getNotifier(this.unit);
            notifier.subscribe(this);
            this.unitNotifier = notifier;
        }
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

    private decimalMaximumDigitsChanged(): void {
        this.updateColumnConfig();
    }

    private unitElementsChanged(): void {
        void this.updateColumnConfigFromUnitElements();
    }

    private async updateColumnConfigFromUnitElements(): Promise<void> {
        if (this.unitElements) {
            await waitUntilCustomElementsDefinedAsync(this.unitElements);
        }
        this.unit = this.unitElements
            ? (this.unitElements.find(x => x instanceof Unit) as Unit)
            : undefined;
        this.observeUnit();
        this.updateColumnConfig();
    }

    private updateColumnConfig(): void {
        this.validator.validateDecimalDigits(this.format, this.decimalDigits);
        this.validator.validateDecimalMaximumDigits(
            this.format,
            this.decimalMaximumDigits
        );
        this.validator.validateNoMutuallyExclusiveProperties(
            this.format,
            this.decimalDigits,
            this.decimalMaximumDigits
        );
        this.validator.validateAtMostOneUnit(this.unitElements ?? []);

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
        const unitScale = this.unit?.getUnitScale() ?? new EmptyUnitScale();
        switch (this.format) {
            case NumberTextFormat.decimal: {
                const minimumDigits = typeof this.decimalMaximumDigits === 'number'
                    ? 0
                    : this.decimalDigits ?? defaultDecimalDigits;
                const maximumDigits = this.decimalMaximumDigits
                    ?? this.decimalDigits
                    ?? defaultDecimalDigits;
                return new DecimalFormatter(
                    lang.getValueFor(this),
                    minimumDigits,
                    maximumDigits,
                    unitScale
                );
            }
            default: {
                return new DefaultFormatter(
                    lang.getValueFor(this),
                    unitScale
                );
            }
        }
    }

    private determineCellContentAlignment(): TextCellViewBaseAlignment {
        if (this.alignment === NumberTextAlignment.left) {
            return TextCellViewBaseAlignment.left;
        }

        if (this.alignment === NumberTextAlignment.right) {
            return TextCellViewBaseAlignment.right;
        }

        // Look at format and decimal max digits and unit to determine the default alignment
        if (
            this.format === NumberTextFormat.decimal
            && typeof this.decimalMaximumDigits !== 'number'
            && !this.unit
        ) {
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
