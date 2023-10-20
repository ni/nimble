import { DesignSystem } from '@microsoft/fast-foundation';
import { IntlNumberFormatUnit } from '../base/intl-number-format-unit';
import { ScaledUnit, UnitScale } from '../base/unit-scale';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-none': UnitNone;
    }
}

/**
 * Element representing no unit labels
 */
export class UnitNone extends UnitScale {
    public getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): ScaledUnit[] {
        return [
            new IntlNumberFormatUnit(
                1,
                new Intl.NumberFormat(lang, formatterOptions)
            )
        ];
    }
}

const nimbleUnitNone = UnitNone.compose({
    baseName: 'unit-none'
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUnitNone());
export const unitNoneTag = DesignSystem.tagFor(UnitNone);
