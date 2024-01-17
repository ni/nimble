import { Inject, InjectionToken, LOCALE_ID, Optional, Pipe, PipeTransform } from '@angular/core';
import { DecimalUnitFormat } from '@ni/nimble-components/dist/esm/utilities/unit-format/decimal-unit-format';
import { passthroughUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/passthrough-unit-scale';
import { byteUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-unit-scale';
import { byte1024UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { voltUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/volt-unit-scale';
import type { UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/unit-scale';

/**
 * Supported unit scales
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const FormatDecimalPipeUnitScale = {
    none: undefined,
    bytes: 'bytes',
    bytes1024: 'bytes1024',
    volts: 'volts'
} as const;
// eslint-disable-next-line @typescript-eslint/no-redeclare
export declare type FormatDecimalPipeUnitScale = (typeof FormatDecimalPipeUnitScale)[keyof typeof FormatDecimalPipeUnitScale];

export interface FormatDecimalOptions {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    unitScale?: FormatDecimalPipeUnitScale;
}

export const FORMAT_DECIMAL_PIPE_OPTIONS = new InjectionToken<FormatDecimalOptions>('FORMAT_DECIMAL_PIPE_OPTIONS');

const defaultFormatDecimalOptions = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    unitScale: FormatDecimalPipeUnitScale.none
};

/**
 * A pipe that transforms a decimal number into a string with optional unit, formatted like "1.2 kB"
 */
@Pipe({
    name: 'formatDecimal'
})
export class FormatDecimalPipe implements PipeTransform {
    private readonly decimalUnitFormatter;

    public constructor(
    @Inject(LOCALE_ID) locale: string,
        @Inject(FORMAT_DECIMAL_PIPE_OPTIONS) @Optional() options: FormatDecimalOptions | null = defaultFormatDecimalOptions
    ) {
        const resolvedOptions = options ?? defaultFormatDecimalOptions;
        if (options) {
            if (resolvedOptions.minimumFractionDigits === undefined) {
                resolvedOptions.minimumFractionDigits = 0;
            }
            if (resolvedOptions.maximumFractionDigits === undefined) {
                resolvedOptions.maximumFractionDigits = Math.max(1, resolvedOptions.minimumFractionDigits);
            }
        }
        let actualUnitScale: UnitScale;
        switch (resolvedOptions.unitScale) {
            case FormatDecimalPipeUnitScale.bytes:
                actualUnitScale = byteUnitScale;
                break;
            case FormatDecimalPipeUnitScale.bytes1024:
                actualUnitScale = byte1024UnitScale;
                break;
            case FormatDecimalPipeUnitScale.volts:
                actualUnitScale = voltUnitScale;
                break;
            default:
                actualUnitScale = passthroughUnitScale;
        }
        this.decimalUnitFormatter = new DecimalUnitFormat(locale, {
            minimumFractionDigits: resolvedOptions.minimumFractionDigits,
            maximumFractionDigits: resolvedOptions.maximumFractionDigits,
            unitScale: actualUnitScale
        });
    }

    public transform(value: number): string {
        return this.decimalUnitFormatter.format(value);
    }
}
