import { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';

/**
 * A scaled unit that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnit extends ScaledUnit {
    public constructor(
        scaleFactor: number,
        private readonly formatter: Intl.NumberFormat
    ) {
        super(scaleFactor);
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
