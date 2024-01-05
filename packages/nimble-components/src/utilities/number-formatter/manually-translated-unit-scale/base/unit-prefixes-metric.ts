import { UnitPrefix } from './unit-prefix';

/**
 * The metric unit prefixes for at least English, French, German, Japanese, and Chinese.
 */
export const unitPrefixesMetric = [
    new UnitPrefix(10 ** -15, 'f'),
    new UnitPrefix(10 ** -12, 'p'),
    new UnitPrefix(10 ** -9, 'n'),
    new UnitPrefix(10 ** -6, 'μ'),
    new UnitPrefix(10 ** -3, 'm'),
    new UnitPrefix(10 ** -2, 'c'),
    new UnitPrefix(10 ** -1, 'd'),
    new UnitPrefix(10 ** 0, ''),
    new UnitPrefix(10 ** 3, 'k'),
    new UnitPrefix(10 ** 6, 'M'),
    new UnitPrefix(10 ** 9, 'G'),
    new UnitPrefix(10 ** 12, 'T'),
    new UnitPrefix(10 ** 15, 'P'),
    new UnitPrefix(10 ** 18, 'E')
] as const;
