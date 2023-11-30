import { NumberFormatter } from './number-formatter';
import { UnitFormatterCache } from './unit-formatter-cache';
import type { UnitScale } from './unit-scale';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    private readonly formatterOptions: Intl.NumberFormatOptions;
    private readonly formatter: Intl.NumberFormat;
    private readonly formatterCache: UnitFormatterCache;

    private readonly tenPowDecimalDigits: number;

    public constructor(
        private readonly locale: string,
        minimumFractionDigits: number,
        maximumFractionDigits: number,
        private readonly unitScale?: UnitScale
    ) {
        super();
        this.formatterOptions = {
            maximumFractionDigits,
            minimumFractionDigits,
            useGrouping: true
        };
        this.formatter = new Intl.NumberFormat(locale, this.formatterOptions);
        this.formatterCache = new UnitFormatterCache(locale, this.formatterOptions);
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
    }

    protected format(number: number): string {
        if (this.unitScale) {
            const scaleInformation = this.unitScale.scaleNumber(number);
            const scaledValue = scaleInformation.scaledValue;
            const unit = scaleInformation.scaledUnit;

            const valueToFormat = this.willRoundToZero(scaledValue) ? 0 : scaledValue;
            const formatter = this.formatterCache.getOrCreateUnitFormatter(unit.scaleFactor, unit.unitFormatterFactory);
            return formatter.format(valueToFormat);
        } else {
            const valueToFormat = this.willRoundToZero(number) ? 0 : number;
            return this.formatter.format(valueToFormat);
        }
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to maximumFractionDigits so that Math.round can be used to emulate rounding to
        // maximumFractionDigits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
