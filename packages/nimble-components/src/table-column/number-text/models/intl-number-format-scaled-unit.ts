import type { ScaledUnit } from './scaled-unit';

/**
 * A scaled unit that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnit implements ScaledUnit {
    public constructor(
        public conversionFactor: number,
        private readonly formatter: Intl.NumberFormat
    ) {}

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
