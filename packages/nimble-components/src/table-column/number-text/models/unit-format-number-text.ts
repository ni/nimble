import {
    UnitFormat,
    type UnitFormatOptions
} from '@ni/unit-format/unit-format';
import { unitScalePassthrough } from '@ni/unit-format/unit-scale/passthrough';
import { UnitFormatDefault } from '@ni/unit-format/default';
import { UnitFormatDecimal } from '@ni/unit-format/decimal';
import { NumberTextFormat } from '../types';

export interface UnitFormatNumberTextOptions extends UnitFormatOptions {
    numberTextFormat?: NumberTextFormat;
    decimalDigits?: number;
    decimalMaximumDigits?: number;
}
type UnitFormatNumberTextResolvedOptions = UnitFormatNumberTextOptions
    & Required<UnitFormatOptions>;

/**
 * Format for numbers (with optional units) in a number-text table column.
 */
export class UnitFormatNumberText extends UnitFormat {
    private static readonly defaultDecimalDigits = 2;
    private readonly resolvedUnitFormat: UnitFormatDefault | UnitFormatDecimal;
    private readonly _resolvedOptions: UnitFormatNumberTextResolvedOptions;

    public constructor(locale: string, options?: UnitFormatNumberTextOptions) {
        super();
        this._resolvedOptions = this.resolveOptions(options);
        this.resolvedUnitFormat = this.resolveUnitFormat(
            locale,
            this._resolvedOptions
        );
    }

    public override resolvedOptions(): UnitFormatNumberTextResolvedOptions {
        return { ...this._resolvedOptions };
    }

    public optionsMatch(targetOptions?: UnitFormatNumberTextOptions): boolean {
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
        options: UnitFormatNumberTextResolvedOptions
    ): UnitFormatDefault | UnitFormatDecimal {
        const {
            numberTextFormat,
            decimalMaximumDigits,
            decimalDigits,
            unitScale
        } = options;

        if (numberTextFormat === NumberTextFormat.default) {
            return new UnitFormatDefault(locale, {
                unitScale
            });
        }
        if (typeof decimalDigits === 'number') {
            return new UnitFormatDecimal(locale, {
                minimumFractionDigits: decimalDigits,
                maximumFractionDigits: decimalDigits,
                unitScale
            });
        }
        return new UnitFormatDecimal(locale, {
            minimumFractionDigits: 0,
            maximumFractionDigits: decimalMaximumDigits,
            unitScale
        });
    }

    private resolveOptions(
        options?: UnitFormatNumberTextOptions
    ): UnitFormatNumberTextResolvedOptions {
        if (!options || options.numberTextFormat === NumberTextFormat.default) {
            return {
                numberTextFormat: NumberTextFormat.default,
                decimalDigits: undefined,
                decimalMaximumDigits: undefined,
                unitScale: options?.unitScale ?? unitScalePassthrough
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
                decimalDigits: UnitFormatNumberText.defaultDecimalDigits,
                decimalMaximumDigits: undefined,
                unitScale: options.unitScale ?? unitScalePassthrough
            };
        }
        return {
            numberTextFormat: NumberTextFormat.decimal,
            decimalDigits: options.decimalDigits,
            decimalMaximumDigits: options.decimalMaximumDigits,
            unitScale: options.unitScale ?? unitScalePassthrough
        };
    }
}
