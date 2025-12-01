import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit';

/**
 * A class that knows how to format a numeric value as a string that includes units.
 */
export abstract class ScaledUnitFormat {
    protected readonly locale: string;
    protected readonly intlNumberFormatOptions?: Intl.NumberFormatOptions;

    protected constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
    ) {
        this.locale = scaledUnitFormatFactoryOptions.locale;
        this.intlNumberFormatOptions = scaledUnitFormatFactoryOptions.intlNumberFormatOptions;
    }

    public abstract format(value: number): string;
}
