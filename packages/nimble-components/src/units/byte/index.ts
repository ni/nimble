import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { IntlNumberFormatUnit } from '../base/intl-number-format-unit';
import type { Unit } from '../base/unit-family';
import { template } from '../base/template';
import { ManuallyTranslatedUnitFamily } from '../base/manually-translated-unit-family';
import { UnitPrefix } from '../base/unit-prefix';
import { UnitTranslation } from '../base/unit-translation';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-unit-byte': UnitFamilyByte;
    }
}

/**
 * Element representing units for bytes
 */
export class UnitFamilyByte extends ManuallyTranslatedUnitFamily {
    // If true, 1024-based units are used instead of 1000-based units
    @attr({ mode: 'boolean' })
    public binary = false;

    public override getSupportedUnits(
        lang: string,
        formatterOptions: Intl.NumberFormatOptions
    ): Unit[] {
        return this.binary
            ? super.getSupportedUnits(lang, formatterOptions)
            : this.getSupportedDecimalUnits(lang, formatterOptions);
    }

    protected override getUnitTranslations(): Map<string, UnitTranslation> {
        const unitTranslations = new Map<string, UnitTranslation>();
        unitTranslations.set('en', new UnitTranslation('byte', 'bytes', 'B'));
        unitTranslations.set('fr', new UnitTranslation('octet', 'octets', 'o'));
        unitTranslations.set('de', new UnitTranslation('Byte', 'Byte', 'B'));
        unitTranslations.set(
            'ja',
            new UnitTranslation('バイト', 'バイト', 'B')
        );
        unitTranslations.set('zh', new UnitTranslation('字节', '字节', 'B'));
        return unitTranslations;
    }

    protected override getSupportedPrefixes(): UnitPrefix[] {
        return [
            new UnitPrefix(1024, 'Ki'),
            new UnitPrefix(1024 ** 2, 'Mi'),
            new UnitPrefix(1024 ** 3, 'Gi'),
            new UnitPrefix(1024 ** 4, 'Ti'),
            new UnitPrefix(1024 ** 5, 'Pi')
        ];
    }

    private getSupportedDecimalUnits(
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
    baseName: 'unit-byte',
    template
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleUnitFamilyByte());
export const unitByteTag = DesignSystem.tagFor(UnitFamilyByte);
