import type { UnitFormatter } from '../../base/unit-formatter';

type UnitFormatterFactoryFunction = (
    locale: string,
    numberFormatOptions: Intl.NumberFormatOptions | undefined
) => UnitFormatter;

/**
 * A unit that represents a scaled version of a base unit.
 */
export class ScaledUnit {
    public constructor(
        public readonly scaleFactor: number,
        public readonly unitFormatterFactory: UnitFormatterFactoryFunction
    ) {}

    public isBase(): boolean {
        return this.scaleFactor === 1;
    }
}
