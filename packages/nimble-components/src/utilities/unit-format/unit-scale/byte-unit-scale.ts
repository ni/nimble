import { IntlNumberFormatScaledUnitFormat } from './base/intl-number-format-scaled-unit-format';
import { ScaledUnit } from './base/scaled-unit';
import { UnitScale } from './base/unit-scale';
/**
 * Byte units (1000-based)
 */
class ByteUnitScale extends UnitScale {
    private static readonly supportedScaledUnits: readonly ScaledUnit[] = [
        new ScaledUnit(
            10 ** 0,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'byte',
                    unitDisplay: 'long'
                }
            )
        ),
        new ScaledUnit(
            10 ** 3,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'kilobyte',
                    unitDisplay: 'short'
                }
            )
        ),
        new ScaledUnit(
            10 ** 6,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'megabyte',
                    unitDisplay: 'short'
                }
            )
        ),
        new ScaledUnit(
            10 ** 9,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'gigabyte',
                    unitDisplay: 'short'
                }
            )
        ),
        new ScaledUnit(
            10 ** 12,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'terabyte',
                    unitDisplay: 'short'
                }
            )
        ),
        new ScaledUnit(
            10 ** 15,
            (
                locale: string,
                intlNumberFormatOptions?: Intl.NumberFormatOptions
            ) => new IntlNumberFormatScaledUnitFormat(
                locale,
                intlNumberFormatOptions,
                {
                    style: 'unit',
                    unit: 'petabyte',
                    unitDisplay: 'short'
                }
            )
        )
    ] as const;

    public constructor() {
        super(ByteUnitScale.supportedScaledUnits);
    }
}

export const byteUnitScale = new ByteUnitScale();
