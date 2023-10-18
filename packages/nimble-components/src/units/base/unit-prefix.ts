/**
 * A prefix that implies a scaling factor when applied to a base unit
 */
export class UnitPrefix {
    public constructor(
        public readonly factor: number,
        public readonly text: string
    ) {}
}

// TODO: do these need translations, or are they the same in all languages (that we support)?
export const metricPrefixes: UnitPrefix[] = [
    new UnitPrefix(10 ** -15, 'f'),
    new UnitPrefix(10 ** -12, 'p'),
    new UnitPrefix(10 ** -9, 'n'),
    new UnitPrefix(10 ** -6, 'μ'),
    new UnitPrefix(0.001, 'm'),
    new UnitPrefix(0.01, 'c'),
    new UnitPrefix(0.1, 'd'),
    new UnitPrefix(1000, 'k'),
    new UnitPrefix(10 ** 6, 'M'),
    new UnitPrefix(10 ** 9, 'G'),
    new UnitPrefix(10 ** 12, 'T'),
    new UnitPrefix(10 ** 15, 'P'),
    new UnitPrefix(10 ** 18, 'E')
];
