import {
    DesignSystem,
    DesignTokenSubscriber
} from '@microsoft/fast-foundation';
import {
    attr,
    Notifier,
    nullableNumberConverter,
    Observable,
    observable,
    Subscriber
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
import type { UnitFormat } from '../../utilities/unit-format/unit-format';
import { NumberTextUnitFormat } from './models/number-text-unit-format';
import { TableColumnNumberTextValidator } from './models/table-column-number-text-validator';
import { TextCellViewBaseAlignment } from '../text-base/cell-view/types';
import { lang } from '../../theme-provider';
import { Unit } from '../../unit/base/unit';
import { waitUntilCustomElementsDefinedAsync } from '../../utilities/wait-until-custom-elements-defined-async';

export type TableColumnNumberTextCellRecord = TableNumberField<'value'>;
export interface TableColumnNumberTextColumnConfig {
    formatter: UnitFormat;
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

    @observable
    private unit?: Unit;

    private unitNotifier?: Notifier;

    private readonly langSubscriber: DesignTokenSubscriber<typeof lang> = {
        handleChange: () => {
            this.updateColumnConfig();
        }
    };

    private readonly unitSubscriber: Subscriber = {
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

    private updateUnitNotifier(): void {
        if (this.unitNotifier) {
            this.unitNotifier.unsubscribe(this.unitSubscriber);
            this.unitNotifier = undefined;
        }

        if (this.unit) {
            const notifier = Observable.getNotifier(this.unit);
            notifier.subscribe(this.unitSubscriber, 'resolvedUnitScale');
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
        void this.updateUnit();
    }

    private async updateUnit(): Promise<void> {
        this.unit = undefined;
        if (this.unitElements) {
            await waitUntilCustomElementsDefinedAsync(this.unitElements);
            this.unit = this.unitElements.find(
                (x): x is Unit => x instanceof Unit
            );
        }
        this.updateUnitNotifier();
    }

    private unitChanged(): void {
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

    private createFormatter(): UnitFormat {
        const unitScale = this.unit?.resolvedUnitScale;
        return new NumberTextUnitFormat(lang.getValueFor(this), {
            // Attribute values sometimes resolve to either null or undefined
            // See https://github.com/microsoft/fast/issues/6630
            numberTextFormat: this.format ?? undefined,
            decimalDigits: this.decimalDigits ?? undefined,
            decimalMaximumDigits: this.decimalMaximumDigits ?? undefined,
            unitScale
        });
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
export const tableColumnNumberTextTag = 'nimble-table-column-number-text';
