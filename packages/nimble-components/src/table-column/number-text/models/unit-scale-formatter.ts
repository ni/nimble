import type { ScaledUnit } from './scaled-unit';
import { NumberFormatter } from './number-formatter';

export type UnitScaleFormatterContructor = new (
    lang: string,
    formatterOptions: Intl.NumberFormatOptions
) => UnitScaleFormatter;

/**
 * A formatter for a number-text column that supports unit labels.
 */
export abstract class UnitScaleFormatter extends NumberFormatter {
    public alwaysUseBaseUnit = false;

    private get supportedUnits(): ScaledUnit[] {
        const values = this.setSupportedUnitsAndBaseUnit();
        return values.supportedUnits;
    }

    private get baseUnit(): ScaledUnit {
        const values = this.setSupportedUnitsAndBaseUnit();
        return values.baseUnit;
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
    private setSupportedUnitsAndBaseUnit(): {
        supportedUnits: ScaledUnit[],
        baseUnit: ScaledUnit
    } {
        // sort from largest to smallest here so that pickBestUnit doesn't have to sort on every call
        const supportedUnits = this.getSupportedUnits(
            this.lang,
            this.formatterOptions
        ).sort((a, b) => (a.conversionFactor < b.conversionFactor ? 1 : -1));
        const baseUnit = supportedUnits.find(x => x.conversionFactor === 1);
        if (!baseUnit) {
            throw new Error(
                'Supported units must include a base unit (conversion factor=1)'
            );
        }
        Object.defineProperty(this, 'supportedUnits', {
            value: supportedUnits,
            writable: false,
            configurable: false
        });
        Object.defineProperty(this, 'baseUnit', {
            value: baseUnit,
            writable: false,
            configurable: false
        });
        return { supportedUnits, baseUnit };
    }
}
