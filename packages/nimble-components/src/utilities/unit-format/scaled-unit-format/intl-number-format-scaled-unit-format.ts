import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit';
import { ScaledUnitFormat } from './scaled-unit-format';

/**
 * A formatter for units that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnitFormat extends ScaledUnitFormat {
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
        ): IntlNumberFormatScaledUnitFormat => new IntlNumberFormatScaledUnitFormat(
            scaledUnitFormatFactoryOptions,
            unitSpecificIntlNumberFormatOptions
        );
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
