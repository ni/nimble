import type { ScaledUnitFormatFactoryOptions } from '../../scaled-unit/index.js';
import { ScaledUnitFormat } from '../index.js';

/**
 * A formatter for units that can be formatted/translated by Intl.NumberFormat
 */
export class ScaledUnitFormatIntlNumberFormat extends ScaledUnitFormat {
    private readonly formatter: Intl.NumberFormat;

    protected constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions,
        unitSpecificIntlNumberFormatOptions: Intl.NumberFormatOptions
    ) {
        super(scaledUnitFormatFactoryOptions);
        this.formatter = new Intl.NumberFormat(this.locale, {
            ...unitSpecificIntlNumberFormatOptions,
            // Application configured options override unit specific options
            ...this.intlNumberFormatOptions
        });
    }

    public static createFactory(
        unitSpecificIntlNumberFormatOptions: Intl.NumberFormatOptions
    ) {
        return (
            scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
        ): ScaledUnitFormatIntlNumberFormat => new ScaledUnitFormatIntlNumberFormat(
            scaledUnitFormatFactoryOptions,
            unitSpecificIntlNumberFormatOptions
        );
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
