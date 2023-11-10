import type { ScaledUnit } from './scaled-unit';
import { NumberFormatter } from './number-formatter';
import type { FormattedNumber } from './formatted-number';

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

    protected abstract getSupportedScaledUnits(
        locale: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[];

    protected override format(number: number): FormattedNumber {
        // Always format -0 as 0
        if (number === 0) {
            return this.baseScaledUnit.format(0);
        }
        if (
            this.supportedScaledUnits.length === 1 // must be baseScaledUnit
            || number === 0
            || number === Infinity
            || number === -Infinity
            || Number.isNaN(number)
            || this.alwaysUseBaseScaledUnit
        ) {
            return this.baseScaledUnit.format(number);
        }
        for (let i = 0; i < this.supportedScaledUnits.length; i++) {
            const unit = this.supportedScaledUnits[i]!;
            const scaledNumber = number / unit.scaleFactor;
            if (Math.abs(scaledNumber) >= 1) {
                let formatted: FormattedNumber | undefined;
                // rounding cannot reduce a number >=1 to <1, but it's
                // possible that rounding up might let us use a larger unit.
                for (let j = i - 1; j >= 0; j--) {
                    const nextLargerUnit = this.supportedScaledUnits[j]!;
                    const formattedByNextLargerUnit = nextLargerUnit.format(
                        number / nextLargerUnit.scaleFactor
                    );
                    if (Math.abs(formattedByNextLargerUnit.number) >= 1) {
                        // unit is a valid choice, but keep looking at larger units
                        formatted = formattedByNextLargerUnit;
                    } else {
                        // not a valid choice, so stop looking
                        break;
                    }
                }
                if (formatted === undefined) {
                    formatted = unit.format(scaledNumber);
                }
                return formatted;
            }
        }
        // none of our units result in a formatted value >= 1
        const smallestUnit = this.supportedScaledUnits[this.supportedScaledUnits.length - 1]!;
        const formatted = smallestUnit.format(
            number / smallestUnit.scaleFactor
        );
        // Use base unit (rather than smallest unit) for 0
        return formatted.number === 0
            ? this.baseScaledUnit.format(0)
            : formatted;
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
