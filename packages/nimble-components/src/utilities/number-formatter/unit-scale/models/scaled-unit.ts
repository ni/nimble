import type { UnitFormatter } from './unit-formatter';

type UnitFormatterFactoryFunction = (
    locale: string,
    numberFormatOptions: Intl.NumberFormatOptions | undefined
) => UnitFormatter;

/**
 * A unit that represents a scaled version of a base unit.
 */
export interface ScaledUnit {
    readonly scaleFactor: number;
    readonly unitFormatterFactory: UnitFormatterFactoryFunction;
}
