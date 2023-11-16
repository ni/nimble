import { ScaledUnit } from '../../../table-column/number-text/models/scaled-unit';

/**
 * A scaled unit that can be formatted/translated by Intl.NumberFormat
 */
export class IntlNumberFormatScaledUnit extends ScaledUnit {
    public constructor(
        scaleFactor: number,
        public readonly formatterOptions: Intl.NumberFormatOptions
    ) {
        super(scaleFactor);
    }

    public override appendUnitIfNeeded(formattedNumber: string): string {
        return formattedNumber;
    }
}
