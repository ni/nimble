/**
 * A class that knows how to format a numeric value as a string that includes units.
 */
export abstract class UnitFormatter {
    public abstract format(value: number): string;
}

export type UnitFormatterFactoryFunction = (
    locale: string,
    numberFormatOptions: Intl.NumberFormatOptions | undefined
) => UnitFormatter;

/**
 * A unit that represents a scaled version of a base unit.
 */
export interface ScaledUnit {
    scaleFactor: number;
    unitFormatterFactory: UnitFormatterFactoryFunction;
}
