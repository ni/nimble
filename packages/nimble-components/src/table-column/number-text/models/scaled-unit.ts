/**
 * A unit whose value can be converted to base units by multiplying by a scale factor
 */
export abstract class ScaledUnit {
    /**
     * @param scaleFactor The scale factor from the base ScaledUnit. The base ScaledUnit is represented as a scaleFactor of 1.
     */
    public constructor(public readonly scaleFactor: number) {}
    public abstract get formatterOptions(): Intl.NumberFormatOptions;
    public abstract appendUnitIfNeeded(
        formattedNumber: string,
        rawNumber: number,
        locale: string,
        pluralRules: Intl.PluralRules
    ): string;
}
