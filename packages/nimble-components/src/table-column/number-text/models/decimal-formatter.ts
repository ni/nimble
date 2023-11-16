import { NumberFormatter } from './number-formatter';
import type { UnitScale } from './unit-scale';

/**
 * The formatter for a number-text column whose format is configured to be 'decimal'.
 */
export class DecimalFormatter extends NumberFormatter {
    // Maps from a "unit" Intl.NumberFormat option to a Intl.NumberFormat instance.
    // If the formatter is not configured with a unit, the key is `undefined`.
    private readonly formatterCache = new Map<
    string | undefined,
    Intl.NumberFormat
    >();

    // Constructing this is costly enough to warrant caching it
    private readonly pluralRules: Intl.PluralRules;

    private readonly tenPowDecimalDigits: number;

    public constructor(
        private readonly locale: string,
        private readonly minimumFractionDigits: number,
        private readonly maximumFractionDigits: number,
        private readonly unitScale?: UnitScale
    ) {
        super();
        this.pluralRules = new Intl.PluralRules(locale);
        this.tenPowDecimalDigits = 10 ** maximumFractionDigits;
    }

    protected format(number: number): string {
        const unit = this.unitScale?.pickBestScaledUnit(number);
        const unitFormatterOption = unit?.formatterOptions.unit;
        if (!this.formatterCache.has(unitFormatterOption)) {
            const formatter = new Intl.NumberFormat(this.locale, {
                ...unit?.formatterOptions,
                maximumFractionDigits: this.maximumFractionDigits,
                minimumFractionDigits: this.minimumFractionDigits,
                useGrouping: true
            });
            this.formatterCache.set(unitFormatterOption, formatter);
        }
        const scaledValue = number / (unit?.scaleFactor ?? 1);
        // The NumberFormat option of `signDisplay: "negative"` is not supported in all browsers nimble supports.
        // Because that option cannot be used to avoid rendering "-0", coerce the value -0 to 0 prior to formatting.
        const valueToFormat = this.willRoundToZero(scaledValue)
            ? 0
            : scaledValue;
        const formatted = this.formatterCache
            .get(unitFormatterOption)!
            .format(valueToFormat);
        return (
            unit?.appendUnitIfNeeded(
                formatted,
                valueToFormat,
                this.locale,
                this.pluralRules
            ) ?? formatted
        );
    }

    private willRoundToZero(number: number): boolean {
        // Multiply the value by 10 raised to maximumFractionDigits so that Math.round can be used to emulate rounding to
        // maximumFractionDigits decimal places. If that rounded value is 0, then the value will be rendered with only 0s.
        return Math.round(number * this.tenPowDecimalDigits) === 0;
    }
}
