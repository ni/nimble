import type { ScaledUnit } from './scaled-unit';

interface ScaledNumber {
    readonly scaledValue: number;
    readonly scaledUnit: ScaledUnit;
}

/**
 * A unit scale consisting of a set of scaled units.
 */
export abstract class UnitScale {
    public readonly baseScaledUnit: ScaledUnit;

    public constructor(
        public readonly supportedScaledUnits: readonly ScaledUnit[]
    ) {
        const unitsSorted = supportedScaledUnits.every(
            (curr, i, arr) => i === 0 || arr[i - 1]!.scaleFactor < curr.scaleFactor
        );
        if (!unitsSorted) {
            throw new Error(
                'Supported scaled units must have unique and ordered scale factors'
            );
        }
        const baseScaledUnit = supportedScaledUnits.find(x => x.isBase());
        if (!baseScaledUnit) {
            throw new Error(
                'Supported scaled units must include a base scaled unit (scale factor=1)'
            );
        }
        this.supportedScaledUnits = supportedScaledUnits;
        this.baseScaledUnit = baseScaledUnit;
    }

    // Note that for the sake of reducing complexity in the implementation,
    // we do NOT consider the effects of rounding when picking the unit to
    // use for a given value. If formatting results in rounding, a value
    // may be shown with an unexpected unit. Examples:
    // - 999 bytes with two significant digits => "1000 bytes" (instead of "1 kB")
    // - 0.00000000000000001 volts (= 0.01 fV) with one fractional digit => "0 fV" (instead of "0 volts")
    public scaleNumber(number: number): ScaledNumber {
        const magnitude = Math.abs(number);
        const onlyBaseScaledUnit = this.supportedScaledUnits.length === 1;
        if (
            onlyBaseScaledUnit
            || magnitude === 0
            || magnitude === Infinity
            || Number.isNaN(magnitude)
        ) {
            return { scaledValue: number, scaledUnit: this.baseScaledUnit };
        }
        for (let i = this.supportedScaledUnits.length - 1; i >= 0; i -= 1) {
            const scaledUnit = this.supportedScaledUnits[i]!;
            if (magnitude / scaledUnit.scaleFactor >= 1) {
                return {
                    scaledValue: number / scaledUnit.scaleFactor,
                    scaledUnit
                };
            }
        }
        const smallestUnit = this.supportedScaledUnits[0]!;
        return {
            scaledValue: number / smallestUnit.scaleFactor,
            scaledUnit: smallestUnit
        };
    }
}
