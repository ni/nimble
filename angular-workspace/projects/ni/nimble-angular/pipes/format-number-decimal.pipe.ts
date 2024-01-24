import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DecimalUnitFormat } from '@ni/nimble-components/dist/esm/utilities/unit-format/decimal-unit-format';
import { TableColumnNumberText } from '@ni/nimble-components/dist/esm/table-column/number-text';
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
    /**
     * @internal
     */
    public decimalUnitFormat?: DecimalUnitFormat;
    private minimumFractionDigits?: number;
    private maximumFractionDigits?: number;
    private unitScale?: UnitScale;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: number, {
        decimalDigits,
        maximumDecimalDigits,
        unitScale = passthroughUnitScale
    }: {
        decimalDigits?: number,
        maximumDecimalDigits?: undefined,
        unitScale?: UnitScale
    } | {
        decimalDigits?: undefined,
        maximumDecimalDigits?: number,
        unitScale?: UnitScale
    } = {
        unitScale: passthroughUnitScale
    }): string {
        const { minimumFractionDigits, maximumFractionDigits } = TableColumnNumberText.convertDigitOptionsForDecimalUnitFormat(
            decimalDigits,
            maximumDecimalDigits
        );
        if (!this.decimalUnitFormat
            || this.minimumFractionDigits !== minimumFractionDigits
            || this.maximumFractionDigits !== maximumFractionDigits
            || this.unitScale !== unitScale) {
            this.minimumFractionDigits = minimumFractionDigits;
            this.maximumFractionDigits = maximumFractionDigits;
            this.unitScale = unitScale;
            this.decimalUnitFormat = new DecimalUnitFormat(this.locale, {
                minimumFractionDigits,
                maximumFractionDigits,
                unitScale: this.unitScale
            });
        }
        return this.decimalUnitFormat.format(value);
    }
}
