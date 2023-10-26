import { ScaledUnit } from './scaled-unit';

/**
 * A degenerate scaled unit that is used only by EmptyScaledUnitFormatter
 */
export class EmptyScaledUnit extends ScaledUnit {
    public constructor(private readonly formatter: Intl.NumberFormat) {
        super(1);
    }

    public format(value: number): string {
        return this.formatter.format(value);
    }
}
