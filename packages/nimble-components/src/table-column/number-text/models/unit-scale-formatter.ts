import type { ScaledUnit } from './scaled-unit';
import { NumberFormatter } from './number-formatter';

export type UnitScaleFormatterConstructor = new (
    lang: string,
    formatterOptions: Intl.NumberFormatOptions
) => UnitScaleFormatter;

/**
 * A formatter for a number-text column that supports unit labels.
 */
export abstract class UnitScaleFormatter extends NumberFormatter {
    public alwaysUseBaseUnit = false;
    private _supportedUnits: ScaledUnit[] = [];
    private _baseUnit!: ScaledUnit;

    private get supportedUnits(): ScaledUnit[] {
        if (this._supportedUnits === undefined) {
            this.setSupportedUnitsAndBaseUnit();
        }
        return this._supportedUnits;
    }

    private get baseUnit(): ScaledUnit {
        if (this._baseUnit === undefined) {
            this.setSupportedUnitsAndBaseUnit();
        }
        return this._baseUnit;
    }

    public constructor(
        private readonly lang: string,
        private readonly formatterOptions: Intl.NumberFormatOptions
    ) {
        super();
    }

    public getValueForBestUnit(number: number): number {
        const unit = this.pickBestUnit(number);
        return number / unit.conversionFactor;
    }

    protected abstract getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[];

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
            || this.alwaysUseBaseUnit
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

    // This is an implemenation of lazy initialization.
    // Ideally, we could initialize supportedUnits and baseUnit in the constructor,
    // but they depend on an abstract method and potentially other state that isn't
    // available until the derived class is finished being constructed.
    private setSupportedUnitsAndBaseUnit(): void {
        // sort from largest to smallest here so that pickBestUnit doesn't have to sort on every call
        this._supportedUnits = this.getSupportedUnits(
            this.lang,
            this.formatterOptions
        ).sort((a, b) => (a.conversionFactor < b.conversionFactor ? 1 : -1));
        const baseUnit = this._supportedUnits.find(
            x => x.conversionFactor === 1
        );
        if (baseUnit) {
            throw new Error(
                'Supported units must include a base unit (conversion factor=1)'
            );
        }
        this._baseUnit = baseUnit!;
    }
}
