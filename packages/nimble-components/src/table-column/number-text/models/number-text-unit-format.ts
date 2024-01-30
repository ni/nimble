import {
    UnitFormat,
    type UnitFormatOptions
} from '../../../utilities/unit-format/unit-format';
import { passthroughUnitScale } from '../../../utilities/unit-format/unit-scale/passthrough-unit-scale';
import { NumberTextFormat } from '../types';
import { DefaultUnitFormat } from '../../../utilities/unit-format/default-unit-format';
import { DecimalUnitFormat } from '../../../utilities/unit-format/decimal-unit-format';

export interface NumberTextUnitFormatOptions extends UnitFormatOptions {
    numberTextFormat?: NumberTextFormat;
    decimalDigits?: number;
    decimalMaximumDigits?: number;
}
type ResolvedNumberTextUnitFormatOptions = NumberTextUnitFormatOptions &
Required<UnitFormatOptions>;

/**
 * Format for numbers (with optional units) in a number-text table column.
 */
export class NumberTextUnitFormat extends UnitFormat {
    private static readonly defaultDecimalDigits = 2;
    private readonly resolvedUnitFormat: DefaultUnitFormat | DecimalUnitFormat;
    private readonly _resolvedOptions: ResolvedNumberTextUnitFormatOptions;

    public constructor(locale: string, options?: NumberTextUnitFormatOptions) {
        super();
        this._resolvedOptions = this.resolveOptions(options);
        this.resolvedUnitFormat = this.resolveUnitFormat(
            locale,
            this._resolvedOptions
        );
    }

    public override resolvedOptions(): ResolvedNumberTextUnitFormatOptions {
        return { ...this._resolvedOptions };
    }

    public optionsMatch(targetOptions?: NumberTextUnitFormatOptions): boolean {
        const targetResolvedOptions = this.resolveOptions(targetOptions);
        return (
            this._resolvedOptions.decimalDigits
                === targetResolvedOptions.decimalDigits
            && this._resolvedOptions.decimalMaximumDigits
                === targetResolvedOptions.decimalMaximumDigits
            && this._resolvedOptions.numberTextFormat
                === targetResolvedOptions.numberTextFormat
            && this._resolvedOptions.unitScale === targetResolvedOptions.unitScale
        );
    }

    protected override tryFormat(number: number): string {
        return this.resolvedUnitFormat.format(number);
    }

    private resolveUnitFormat(
        locale: string,
        options: ResolvedNumberTextUnitFormatOptions
    ): DefaultUnitFormat | DecimalUnitFormat {
        const {
            numberTextFormat,
            decimalMaximumDigits,
            decimalDigits,
            unitScale
        } = options;

        if (numberTextFormat === NumberTextFormat.default) {
            return new DefaultUnitFormat(locale, {
                unitScale
            });
        }
        if (typeof decimalDigits === 'number') {
            return new DecimalUnitFormat(locale, {
                minimumFractionDigits: decimalDigits,
                maximumFractionDigits: decimalDigits,
                unitScale
            });
        }
        return new DecimalUnitFormat(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimalMaximumDigits,
            unitScale
        });
    }

    private resolveOptions(
        options?: NumberTextUnitFormatOptions
    ): ResolvedNumberTextUnitFormatOptions {
        if (!options || options.numberTextFormat === NumberTextFormat.default) {
            return {
                numberTextFormat: NumberTextFormat.default,
                decimalDigits: undefined,
                decimalMaximumDigits: undefined,
                unitScale: options?.unitScale ?? passthroughUnitScale
            };
        }
        const hasDecimalDigits = typeof options.decimalDigits === 'number';
        const hasDecimalMaximumDigits = typeof options.decimalMaximumDigits === 'number';
        if (hasDecimalDigits && hasDecimalMaximumDigits) {
            throw new Error(
                'decimalDigits and decimalMaximumDigits are mutually exclusive. Do not specify both.'
            );
        }
        if (!hasDecimalDigits && !hasDecimalMaximumDigits) {
            return {
                numberTextFormat: NumberTextFormat.decimal,
                decimalDigits: NumberTextUnitFormat.defaultDecimalDigits,
                decimalMaximumDigits: undefined,
                unitScale: options.unitScale ?? passthroughUnitScale
            };
        }
        return {
            numberTextFormat: NumberTextFormat.decimal,
            decimalDigits: options.decimalDigits,
            decimalMaximumDigits: options.decimalMaximumDigits,
            unitScale: options.unitScale ?? passthroughUnitScale
        };
    }
}
