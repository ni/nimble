import { DesignSystem } from '@microsoft/fast-foundation';
import { IntlNumberFormatUnit } from '../base/intl-number-format-unit';
import { Unit, UnitFamily } from '../base/unit-family';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-none': UnitFamilyNone;
    }
}

/**
 * Element representing no unit labels
 */
export class UnitFamilyNone extends UnitFamily {
    public getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[] {
        return [
            new IntlNumberFormatUnit(
                1,
                new Intl.NumberFormat(lang, formatterOptions)
            )
        ];
    }
}

const nimbleUnitFamilyNone = UnitFamilyNone.compose({
    baseName: 'unit-none'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFamilyNone());
export const unitNoneTag = DesignSystem.tagFor(UnitFamilyNone);
