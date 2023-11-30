/**
 * A unit whose value can be converted to base units by multiplying by a scale factor
 */
export abstract class UnitFormatter {
    // /**
    //  * @param scaleFactor The scale factor from the base ScaledUnit. The base ScaledUnit is represented as a scaleFactor of 1.
    //  */
    public abstract format(value: number): string;
}

// export type UnitFormatterConstructor = abstract new (numberFormatOptions: Intl.NumberFormatOptions | undefined) => UnitFormatter;

export type UnitFormatterFactoryFunction = (locale: string, numberFormatOptions: Intl.NumberFormatOptions | undefined) => UnitFormatter;

export interface ScaledUnit {
    scaleFactor: number;
    unitFormatterFactory: UnitFormatterFactoryFunction;
}
