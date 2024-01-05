import { NumberFormatter } from './base/number-formatter';
import type { UnitFormatter } from './base/unit-formatter';
import type { UnitScale } from './unit-scale/base/unit-scale';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly unitFormatters = new Map<number, UnitFormatter>();
    private readonly tenPowDecimalDigits: number;
    private readonly unitScale: UnitScale;

    public constructor(
        locale: string,
        {
            minimumFractionDigits,
            maximumFractionDigits,
            unitScale
        }: {
            minimumFractionDigits: number,
            maximumFractionDigits: number,
            unitScale: UnitScale
        }
    ) {
        super();
        this.unitScale = unitScale;
        const decimalFormatterOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        };
        for (const unit of unitScale.supportedScaledUnits) {
            this.unitFormatters.set(
                unit.scaleFactor,
                unit.unitFormatterFactory(locale, decimalFormatterOptions)
            );
        }
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
    }

    protected tryFormat(number: number): string {
        const { scaledValue, scaledUnit } = this.unitScale.scaleNumber(number);

        const valueToFormat = this.willRoundToZero(scaledValue)
            ? 0
            : scaledValue;
        const formatter = this.unitFormatters.get(scaledUnit.scaleFactor)!;
        return formatter.format(valueToFormat);
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to maximumFractionDigits so that Math.round can be used to emulate rounding to
        // maximumFractionDigits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
