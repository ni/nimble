import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DecimalUnitFormat } from '@ni/nimble-components/dist/esm/utilities/unit-format/decimal-unit-format';
import { passthroughUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/passthrough-unit-scale';
import { byteUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-unit-scale';
import { byte1024UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { voltUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/volt-unit-scale';
import type { UnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/unit-scale';

export { byteUnitScale, byte1024UnitScale, voltUnitScale };

/**
 * A pipe that transforms a decimal number into a string with optional unit, formatted like "1.2 kB"
 */
@Pipe({
    name: 'formatNumberDecimal',
    standalone: true
})
export class FormatNumberDecimalPipe implements PipeTransform {
    private static instanceCount = 0;
    /**
     * @internal
     */
    public decimalUnitFormat?: DecimalUnitFormat;
    private minimumFractionDigits?: number;
    private maximumFractionDigits?: number;
    private unitScale?: UnitScale;
    private readonly instanceNumber;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {
        FormatNumberDecimalPipe.instanceCount += 1;
        this.instanceNumber = FormatNumberDecimalPipe.instanceCount;
    }

    public transform(value: number, {
        minimumFractionDigits = 0,
        maximumFractionDigits = Math.max(1, minimumFractionDigits),
        unitScale = passthroughUnitScale,
        debugInstance = false
    }: {
        minimumFractionDigits?: number,
        maximumFractionDigits?: number,
        unitScale?: UnitScale,
        debugInstance?: boolean
    } = {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        unitScale: passthroughUnitScale,
        debugInstance: false
    }): string {
        if (!this.decimalUnitFormat
            || this.minimumFractionDigits !== minimumFractionDigits
            || this.maximumFractionDigits !== maximumFractionDigits
            || this.unitScale !== unitScale) {
            this.minimumFractionDigits = minimumFractionDigits;
            this.maximumFractionDigits = maximumFractionDigits;
            this.unitScale = unitScale;
            this.decimalUnitFormat = new DecimalUnitFormat(this.locale, {
                minimumFractionDigits: this.minimumFractionDigits,
                maximumFractionDigits: this.maximumFractionDigits,
                unitScale: this.unitScale
            });
        }
        return `${debugInstance ? `${this.instanceNumber}@` : ''}${this.decimalUnitFormat.format(value)}`;
    }
}
