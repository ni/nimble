import type { ScaledUnit } from './scaled-unit';

/**
 * A unit scale consisting of a set of scaled units.
 */
export abstract class UnitScale {
    private _supportedScaledUnits?: ScaledUnit[];
    private _baseScaledUnit?: ScaledUnit;

    public get supportedScaledUnits(): ScaledUnit[] {
        if (this._supportedScaledUnits === undefined) {
            this.initializeSupportedScaledUnitsAndBaseScaledUnit();
        }
        return this._supportedScaledUnits!;
    }

    public get baseScaledUnit(): ScaledUnit {
        if (this._baseScaledUnit === undefined) {
            this.initializeSupportedScaledUnitsAndBaseScaledUnit();
        }
        return this._baseScaledUnit!;
    }

    // Note that for the sake of reducing complexity in the implementation,
    // we do NOT consider the effects of rounding when picking the unit to
    // use for a given value. If formatting results in rounding, a value
    // may be shown with an unexpected unit. Examples:
    // - 999 bytes with two significant digits => "1000 bytes" (instead of "1 kB")
    // - 0.00000000000000001 volts (= 0.01 fV) with one fractional digit => "0 fV" (instead of "0 volts")
    public scaleNumber(number: number): {
        scaledValue: number,
        scaledUnit: ScaledUnit
    } {
        const magnitude = Math.abs(number);
        if (
            this.supportedScaledUnits.length === 1 // must be baseScaledUnit
            || magnitude === 0
            || magnitude === Infinity
            || Number.isNaN(magnitude)
        ) {
            return { scaledValue: number, scaledUnit: this.baseScaledUnit };
        }
        for (const unit of this.supportedScaledUnits) {
            if (magnitude / unit.scaleFactor >= 1) {
                return {
                    scaledValue: number / unit.scaleFactor,
                    scaledUnit: unit
                };
            }
        }
        const smallestUnit = this.supportedScaledUnits[this.supportedScaledUnits.length - 1]!;
        return {
            scaledValue: number / smallestUnit.scaleFactor,
            scaledUnit: smallestUnit
        };
    }

    protected abstract getSupportedScaledUnits(): ScaledUnit[];

    // Ideally, we could initialize supportedScaledUnits and baseScaledUnit in the constructor,
    // but they depend on an abstract method and potentially other state that isn't
    // available until the derived class is finished being constructed.
    private initializeSupportedScaledUnitsAndBaseScaledUnit(): void {
        // sort from largest to smallest here so that pickBestUnit doesn't have to sort on every call
        this._supportedScaledUnits = this.getSupportedScaledUnits().sort(
            (a, b) => (a.scaleFactor < b.scaleFactor ? 1 : -1)
        );
        const baseScaledUnit = this._supportedScaledUnits.find(
            x => x.scaleFactor === 1
        );
        if (!baseScaledUnit) {
            throw new Error(
                'Supported scaled units must include a base scaled unit (scale factor=1)'
            );
        }
        this._baseScaledUnit = baseScaledUnit;
    }
}
