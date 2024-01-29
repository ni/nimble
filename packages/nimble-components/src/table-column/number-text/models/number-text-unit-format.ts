import {
    UnitFormat,
    type UnitFormatOptions
} from '../../../utilities/unit-format/unit-format';
import type { UnitScale } from '../../../utilities/unit-format/unit-scale/unit-scale';
import { passthroughUnitScale } from '../../../utilities/unit-format/unit-scale/passthrough-unit-scale';
import { NumberTextFormat } from '../types';
import { DefaultUnitFormat } from '../../../utilities/unit-format/default-unit-format';
import { DecimalUnitFormat } from '../../../utilities/unit-format/decimal-unit-format';

interface NumberTextUnitFormatOptions extends UnitFormatOptions {
    numberTextFormat: NumberTextFormat;
    decimalDigits?: number;
    decimalMaximumDigits?: number;
    unitScale?: UnitScale;
}

/**
 * Format for decimal numbers with units.
 */
export class NumberTextUnitFormat extends UnitFormat {
    private static readonly defaultDecimalDigits = 2;
    private readonly actualUnitFormat: DefaultUnitFormat | DecimalUnitFormat;

    public constructor(
        locale: string,
        {
            numberTextFormat,
            decimalDigits,
            decimalMaximumDigits,
            unitScale = passthroughUnitScale
        }: NumberTextUnitFormatOptions
    ) {
        super();
        if (numberTextFormat === NumberTextFormat.default) {
            this.actualUnitFormat = new DefaultUnitFormat(locale, {
                unitScale
            });
        } else {
            const decimalDigitsHasValue = typeof decimalDigits === 'number';
            const decimalMaximumDigitsHasValue = typeof decimalMaximumDigits === 'number';
            if (decimalDigitsHasValue && decimalMaximumDigitsHasValue) {
                throw new Error(
                    'decimalDigits is mutually exclusive with decimalMaximumDigits. Do not specify both.'
                );
            }
            const minimumFractionDigits = decimalMaximumDigitsHasValue
                ? 0
                : decimalDigits ?? NumberTextUnitFormat.defaultDecimalDigits;
            const maximumFractionDigits = decimalMaximumDigits
                ?? decimalDigits
                ?? NumberTextUnitFormat.defaultDecimalDigits;
            this.actualUnitFormat = new DecimalUnitFormat(locale, {
                minimumFractionDigits,
                maximumFractionDigits,
                unitScale
            });
        }
    }

    public override resolvedOptions(): Required<UnitFormatOptions> {
        return this.actualUnitFormat.resolvedOptions();
    }

    protected override tryFormat(number: number): string {
        return this.actualUnitFormat.format(number);
    }
}
