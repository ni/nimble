import { DesignSystem } from '@microsoft/fast-foundation';
import { IntlNumberFormatUnit } from '../base/intl-number-format-unit';
import { UnitFamily, type Unit } from '../base/unit-family';
import { template } from '../base/template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-family-byte': UnitFamilyByte;
    }
}

/**
 * TODO
 */
export class UnitFamilyByte extends UnitFamily {
    public getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[] {
        return [
            new IntlNumberFormatUnit(
                1,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'byte',
                    unitDisplay: 'long'
                })
            ),
            new IntlNumberFormatUnit(
                1000,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'kilobyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 6,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'megabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 9,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'gigabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 12,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'terabyte',
                    unitDisplay: 'short'
                })
            ),
            new IntlNumberFormatUnit(
                10 ** 15,
                new Intl.NumberFormat(lang, {
                    ...formatterOptions,
                    style: 'unit',
                    unit: 'petabyte',
                    unitDisplay: 'short'
                })
            )
        ];
    }
}

const nimbleUnitFamilyByte = UnitFamilyByte.compose({
    baseName: 'unit-family-byte',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFamilyByte());
export const unitFamilyByteTag = DesignSystem.tagFor(UnitFamilyByte);
