import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { NumberTextFormat } from '@ni/nimble-components/dist/esm/table-column/number-text/types';
import { NumberTextUnitFormat } from '@ni/nimble-components/dist/esm/table-column/number-text/models/number-text-unit-format';
import { passthroughUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/passthrough-unit-scale';
import { byteUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-unit-scale';
import { byte1024UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { voltUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/volt-unit-scale';
import type { UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/unit-scale';

export { byteUnitScale, byte1024UnitScale, voltUnitScale };

/**
 * A pipe that transforms a number into a string with optional unit
 */
@Pipe({
    name: 'formatNumberText',
    standalone: true
})
export class FormatNumberTextPipe implements PipeTransform {
    /**
     * @internal
     */
    public numberTextUnitFormat?: NumberTextUnitFormat;
    private numberTextFormat?: NumberTextFormat;
    private decimalDigits?: number;
    private decimalMaximumDigits?: number;
    private unitScale?: UnitScale;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: number, {
        numberTextFormat = NumberTextFormat.default,
        decimalDigits,
        decimalMaximumDigits,
        unitScale = passthroughUnitScale
    }: {
        numberTextFormat: 'decimal',
        decimalDigits?: number,
        decimalMaximumDigits?: undefined,
        unitScale?: UnitScale
    } | {
        numberTextFormat: 'decimal',
        decimalDigits?: undefined,
        decimalMaximumDigits?: number,
        unitScale?: UnitScale
    } | {
        numberTextFormat?: undefined,
        decimalDigits?: undefined,
        decimalMaximumDigits?: undefined,
        unitScale?: UnitScale
    } = {
        unitScale: passthroughUnitScale
    }): string {
        if (!this.numberTextUnitFormat
            || this.numberTextFormat !== numberTextFormat
            || this.decimalDigits !== decimalDigits
            || this.decimalMaximumDigits !== decimalMaximumDigits
            || this.unitScale !== unitScale) {
            this.numberTextFormat = numberTextFormat;
            this.decimalDigits = decimalDigits;
            this.decimalMaximumDigits = decimalMaximumDigits;
            this.unitScale = unitScale;
            this.numberTextUnitFormat = new NumberTextUnitFormat(this.locale, {
                numberTextFormat,
                decimalDigits,
                decimalMaximumDigits,
                unitScale
            });
        }
        return this.numberTextUnitFormat.format(value);
    }
}
