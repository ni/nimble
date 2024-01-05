/**
 * A class that knows how to format a numeric value as a string that includes units.
 */
export abstract class UnitFormatter {
    public abstract format(value: number): string;
}
