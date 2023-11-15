import type { ScaledUnit } from './scaled-unit';
import { NumberFormatter } from './number-formatter';

export type UnitScaleFormatterConstructor = new (
    locale: string,
    formatterOptions: Intl.NumberFormatOptions
) => UnitScaleFormatter;

/**
 * A formatter for a number-text column that supports unit labels.
 */
export abstract class UnitScaleFormatter extends NumberFormatter {
    public alwaysUseBaseScaledUnit = false;
    private _supportedScaledUnits?: ScaledUnit[];
    private _baseScaledUnit?: ScaledUnit;

    private get supportedScaledUnits(): ScaledUnit[] {
        if (this._supportedScaledUnits === undefined) {
            this.setSupportedScaledUnitsAndBaseScaledUnit();
        }
        return this._supportedScaledUnits!;
    }

    private get baseScaledUnit(): ScaledUnit {
        if (this._baseScaledUnit === undefined) {
            this.setSupportedScaledUnitsAndBaseScaledUnit();
        }
        return this._baseScaledUnit!;
    }

    public constructor(
        private readonly locale: string,
        private readonly formatterOptions: Intl.NumberFormatOptions
    ) {
        super();
    }

    public getScaledValue(number: number): number {
        const unit = this.pickBestUnit(number);
        return number / unit.scaleFactor;
    }

    protected abstract getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[];

    protected override format(number: number): string {
        const unit = this.pickBestUnit(number);
        return unit.format(number / unit.scaleFactor);
    }

    // Note that for the sake of reducing complexity in the implementation,
    // we do NOT consider the effects of rounding when picking the unit to
    // use for a given value. This means that depending on the Intl.NumberFormatOptions
    // passed into the constructor, rounding may result in a value being
    // formatted with an unexpected unit. Examples:
    // - 999 bytes with two significant digits => "1000 bytes" (instead of "1 kB")
    // - 0.00000000000000001 volts (= 0.01 fV) with one fractional digit => "0 fV" (instead of "0 volts")
    private pickBestUnit(number: number): ScaledUnit {
        const magnitude = Math.abs(number);
        if (
            this.supportedScaledUnits.length === 1 // must be baseScaledUnit
            || magnitude === 0
            || magnitude === Infinity
            || Number.isNaN(magnitude)
            || this.alwaysUseBaseScaledUnit
        ) {
            return this.baseScaledUnit;
        }
        for (const unit of this.supportedScaledUnits) {
            if (magnitude / unit.scaleFactor >= 1) {
                return unit;
            }
        }
        return this.supportedScaledUnits[this.supportedScaledUnits.length - 1]!;
    }

    // Ideally, we could initialize supportedScaledUnits and baseScaledUnit in the constructor,
    // but they depend on an abstract method and potentially other state that isn't
    // available until the derived class is finished being constructed.
    private setSupportedScaledUnitsAndBaseScaledUnit(): void {
        // sort from largest to smallest here so that pickBestUnit doesn't have to sort on every call
        this._supportedScaledUnits = this.getSupportedScaledUnits(
            this.locale,
            this.formatterOptions
        ).sort((a, b) => (a.scaleFactor < b.scaleFactor ? 1 : -1));
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
