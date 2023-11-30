import { NumberFormatter } from './number-formatter';
import { UnitFormatterCache } from './unit-formatter-cache';
import type { UnitScale } from './unit-scale';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly unitFormatterCache: UnitFormatterCache;
    private readonly tenPowDecimalDigits: number;

    public constructor(
        locale: string,
        minimumFractionDigits: number,
        maximumFractionDigits: number,
        private readonly unitScale: UnitScale
    ) {
        super();
        const decimalFormatterOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        };
        this.unitFormatterCache = new UnitFormatterCache(locale, decimalFormatterOptions);
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
    }

    protected format(number: number): string {
        const { scaledValue, scaledUnit: unit } = this.unitScale.scaleNumber(number);

        const valueToFormat = this.willRoundToZero(scaledValue) ? 0 : scaledValue;
        const formatter = this.unitFormatterCache.getOrCreateUnitFormatter(unit.scaleFactor, unit.unitFormatterFactory);
        return formatter.format(valueToFormat);
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to maximumFractionDigits so that Math.round can be used to emulate rounding to
        // maximumFractionDigits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
