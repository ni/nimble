import { IntlNumberFormatUnitFormatter } from './models/intl-number-format-unit-formatter';
import type { ScaledUnit } from './models/scaled-unit';
import { UnitScale } from './unit-scale';
/**
 * Byte units (1000-based)
 */
class ByteUnitScale extends UnitScale {
    private static readonly supportedScaledUnits: readonly ScaledUnit[] = [
        {
            scaleFactor: 1,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'byte',
                        unitDisplay: 'long'
                    }
                );
            }
        },
        {
            scaleFactor: 1000,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'kilobyte',
                        unitDisplay: 'short'
                    }
                );
            }
        },
        {
            scaleFactor: 10 ** 6,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'megabyte',
                        unitDisplay: 'short'
                    }
                );
            }
        },
        {
            scaleFactor: 10 ** 9,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'gigabyte',
                        unitDisplay: 'short'
                    }
                );
            }
        },
        {
            scaleFactor: 10 ** 12,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'terabyte',
                        unitDisplay: 'short'
                    }
                );
            }
        },
        {
            scaleFactor: 10 ** 15,
            unitFormatterFactory: (
                locale: string,
                numberFormatOptions: Intl.NumberFormatOptions | undefined
            ) => {
                return new IntlNumberFormatUnitFormatter(
                    locale,
                    numberFormatOptions,
                    {
                        style: 'unit',
                        unit: 'petabyte',
                        unitDisplay: 'short'
                    }
                );
            }
        }
    ] as const;

    public constructor() {
        super(ByteUnitScale.supportedScaledUnits);
    }
}

export const byteUnitScale = new ByteUnitScale();
