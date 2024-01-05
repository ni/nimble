import type { ScaledUnitFormat } from './scaled-unit-format';

type ScaledUnitFormatFactory = (
    locale: string,
    intlNumberFormatOptions?: Intl.NumberFormatOptions
) => ScaledUnitFormat;

/**
 * A unit that represents a scaled version of a base unit.
 */
export class ScaledUnit {
    public constructor(
        public readonly scaleFactor: number,
        public readonly scaledUnitFormatFactory: ScaledUnitFormatFactory
    ) {}

    public isBase(): boolean {
        return this.scaleFactor === 1;
    }
}
