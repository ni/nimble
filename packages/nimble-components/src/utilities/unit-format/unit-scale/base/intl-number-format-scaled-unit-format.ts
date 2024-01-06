import type { ScaledUnitFormatFactoryOptions } from './scaled-unit';
import { ScaledUnitFormat } from './scaled-unit-format';

/**
 * A formatter for units that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnitFormat extends ScaledUnitFormat {
    private readonly formatter: Intl.NumberFormat;

    public constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions,
        unitSpecificIntlNumberFormatOptions: Intl.NumberFormatOptions = {}
    ) {
        super();
        const {
            locale,
            intlNumberFormatOptions
        } = scaledUnitFormatFactoryOptions;
        this.formatter = new Intl.NumberFormat(locale, {
            ...unitSpecificIntlNumberFormatOptions,
            ...intlNumberFormatOptions
        });
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
