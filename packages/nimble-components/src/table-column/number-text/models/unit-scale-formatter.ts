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

    public getScaledNumber(number: number): number {
        const unit = this.pickBestScaledUnit(number);
        return number / unit.scaleFactor;
    }

    protected abstract getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[];

    protected override format(number: number): string {
        const unit = this.pickBestScaledUnit(number);
        return unit.format(number / unit.scaleFactor);
    }

    private pickBestScaledUnit(number: number): ScaledUnit {
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
            if (magnitude >= unit.scaleFactor) {
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
