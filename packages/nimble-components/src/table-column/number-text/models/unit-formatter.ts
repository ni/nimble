import type { ScaledUnit } from '../../../units/base/unit-scale';
import { NumberFormatter } from './number-formatter';

/**
 * A formatter for a number-text column that supports unit labels.
 */
export class UnitFormatter extends NumberFormatter {
    private readonly baseUnit: ScaledUnit;

    public constructor(private readonly supportedUnits: ScaledUnit[]) {
        super();
        this.baseUnit = supportedUnits.find(x => x.conversionFactor === 1)!;
        if (!this.baseUnit) {
            throw new Error(
                'Supported units must include a base unit (conversion factor= 1)'
            );
        }
        // sort from largest to smallest here so that pickBestUnit doesn't have to sort on every call
        this.supportedUnits = this.supportedUnits.sort((a, b) => (a.conversionFactor < b.conversionFactor ? 1 : -1));
    }

    public getValueForBestUnit(number: number): number {
        const unit = this.pickBestUnit(number);
        return number / unit.conversionFactor;
    }

    protected override format(number: number): string {
        const unit = this.pickBestUnit(number);
        return unit.format(number / unit.conversionFactor);
    }

    private pickBestUnit(number: number): ScaledUnit {
        const magnitude = Math.abs(number);
        if (
            magnitude === 0
            || magnitude === Infinity
            || Number.isNaN(magnitude)
        ) {
            return this.baseUnit;
        }
        for (const unit of this.supportedUnits) {
            if (magnitude >= unit.conversionFactor) {
                return unit;
            }
        }
        return this.supportedUnits[this.supportedUnits.length - 1]!;
    }
}
