import type { UnitFormatter } from './unit-formatter';

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
