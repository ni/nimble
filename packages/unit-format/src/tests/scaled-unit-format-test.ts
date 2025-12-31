import { ScaledUnitFormatIntlNumberFormat } from '../scaled-unit-format/intl-number-format.js';
import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit.js';

/**
 * A ScaledUnitFormat that behaves like IntlNumberFormatScaledUnitFormat but also includes the scaleFactor in the formatted number
 */
export class ScaledUnitFormatTest extends ScaledUnitFormatIntlNumberFormat {
    protected constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions,
        private readonly scaleFactor: number
    ) {
        super(scaledUnitFormatFactoryOptions, {});
    }

    public static createTestFactory(
        scaleFactor: number
    ): (options: ScaledUnitFormatFactoryOptions) => ScaledUnitFormatTest {
        return (
            scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
        ) => new ScaledUnitFormatTest(
            scaledUnitFormatFactoryOptions,
            scaleFactor
        );
    }

    public override format(value: number): string {
        return `${super.format(value)} x${this.scaleFactor}`;
    }
}
