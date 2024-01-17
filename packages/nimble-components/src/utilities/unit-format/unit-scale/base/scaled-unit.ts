import type { ScaledUnitFormat } from './scaled-unit-format';

export interface ScaledUnitFormatFactoryOptions {
    readonly locale: string;
    readonly intlNumberFormatOptions?: Intl.NumberFormatOptions;
}

type ScaledUnitFormatFactory = (
    scaledUnitFormatFactoryOptions: ScaledUnitFormatFactoryOptions
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
