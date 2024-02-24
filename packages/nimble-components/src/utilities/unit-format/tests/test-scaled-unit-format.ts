import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit';

/**
 * A ScaledUnitFormat that behaves like IntlNumberFormatScaledUnitFormat but also includes the scaleFactor in the formatted number
 */
export class TestScaledUnitFormat extends IntlNumberFormatScaledUnitFormat {
    protected constructor(
        scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions,
        private readonly scaleFactor: number
    ) {
        super(scaledUnitFormatFactoryOptions, {});
    }

    public static createTestFactory(
        scaleFactor: number
    ): (options: ScaledUnitFormatFactoryOptions) => TestScaledUnitFormat {
        return (
            scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
        ) => new TestScaledUnitFormat(
            scaledUnitFormatFactoryOptions,
            scaleFactor
        );
    }

    public override format(value: number): string {
        return `${super.format(value)} x${this.scaleFactor}`;
    }
}
