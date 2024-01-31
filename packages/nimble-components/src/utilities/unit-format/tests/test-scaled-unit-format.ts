import { IntlNumberFormatScaledUnitFormat } from '../scaled-unit-format/intl-number-format-scaled-unit-format';
import type { ScaledUnitFormatFactoryOptions } from '../scaled-unit/scaled-unit';

/**
 * An IntlNumberFormatScaledUnitFormat used in tests
 */
export class TestScaledUnitFormat extends IntlNumberFormatScaledUnitFormat {
    public constructor(
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
