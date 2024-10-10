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

import { styles } from '@ni/nimble-components/src/table-column/base/styles';
import { TableColumnAlignment, type TableNumberField } from '@ni/nimble-components/src/table/types';
import { TableColumnTextBase, mixinTextBase } from '@ni/nimble-components/src/table-column/text-base';
import { TableColumnSortOperation } from '@ni/nimble-components/src/table-column/base/types';
import type { ColumnInternalsOptions } from '@ni/nimble-components/src/table-column/base/models/column-internals';
import type { UnitFormat } from '@ni/nimble-components/src/utilities/unit-format/unit-format';
import { lang } from '@ni/nimble-components/src/theme-provider';
import { Unit } from '@ni/nimble-components/src/unit/base/unit';
import { waitUntilCustomElementsDefinedAsync } from '@ni/nimble-components/src/utilities/wait-until-custom-elements-defined-async';
import type { TableColumnTextBaseColumnConfig } from '@ni/nimble-components/src/table-column/text-base/cell-view';
import { template } from './template';
import { tableColumnPlotGroupHeaderTag } from './group-header-view';
import { tableColumnPlotCellViewTag } from './cell-view';
import { NumberTextAlignment, NumberTextFormat } from './types';
import { NumberTextUnitFormat } from './models/number-text-unit-format';
import { TableColumnNumberTextValidator } from './models/table-column-number-text-validator';

export type TableColumnPlotCellRecord = TableNumberField<'value' | 'plotEnabled'>;
export interface TableColumnPlotColumnConfig
    extends TableColumnTextBaseColumnConfig {
    formatter: UnitFormat;
    alignment: TableColumnAlignment;
}

declare global {
    interface HTMLElementTagNameMap {
        'nimble-table-column-plot': TableColumnPlot;
    }
}

/**
 * The table column for displaying numbers as text.
 */
export class TableColumnPlot extends mixinTextBase(
    TableColumnTextBase<
    TableColumnPlotColumnConfig,
    TableColumnNumberTextValidator
    >
) {
    @attr({ attribute: 'plot-enabled-field-name' })
    public plotEnabledFieldName?: string;

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

    public plotEnabledFieldNameChanged(): void {
        this.columnInternals.dataRecordFieldNames = [
            this.fieldName,
            this.plotEnabledFieldName
        ] as const;
        this.columnInternals.operandDataRecordFieldName = this.fieldName;
    }

    public placeholderChanged(): void {
        this.updateColumnConfig();
    }

    protected override getColumnInternalsOptions(): ColumnInternalsOptions<TableColumnNumberTextValidator> {
        return {
            cellRecordFieldNames: ['value', 'plotEnabled'],
            cellViewTag: tableColumnPlotCellViewTag,
            groupHeaderViewTag: tableColumnPlotGroupHeaderTag,
            delegatedEvents: [],
            sortOperation: TableColumnSortOperation.basic,
            validator: new TableColumnNumberTextValidator()
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
        const validator = this.columnInternals.validator;
        validator.validateDecimalDigits(this.format, this.decimalDigits);
        validator.validateDecimalMaximumDigits(
            this.format,
            this.decimalMaximumDigits
        );
        validator.validateNoMutuallyExclusiveProperties(
            this.format,
            this.decimalDigits,
            this.decimalMaximumDigits
        );
        validator.validateAtMostOneUnit(this.unitElements ?? []);

        if (validator.isValid()) {
            const columnConfig: TableColumnPlotColumnConfig = {
                formatter: this.createFormatter(),
                alignment: this.determineCellContentAlignment(),
                placeholder: this.placeholder
            };
            this.columnInternals.headerAlignment = columnConfig.alignment;
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

    private determineCellContentAlignment(): TableColumnAlignment {
        if (this.alignment === NumberTextAlignment.left) {
            return TableColumnAlignment.left;
        }

        if (this.alignment === NumberTextAlignment.right) {
            return TableColumnAlignment.right;
        }

        // Look at format and decimal max digits and unit to determine the default alignment
        if (
            this.format === NumberTextFormat.decimal
            && typeof this.decimalMaximumDigits !== 'number'
            && !this.unit
        ) {
            return TableColumnAlignment.right;
        }
        return TableColumnAlignment.left;
    }
}

const nimbleTableColumnPlot = TableColumnPlot.compose({
    baseName: 'table-column-plot',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleTableColumnPlot());
export const tableColumnPlotTag = 'nimble-table-column-plot';
