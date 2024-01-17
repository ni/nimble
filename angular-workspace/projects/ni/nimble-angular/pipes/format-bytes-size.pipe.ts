import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DecimalUnitFormat } from '@ni/nimble-components/dist/esm/utilities/unit-format/decimal-unit-format';
import { byteUnitScale } from '@ni/nimble-components/dist/esm/utilities/unit-format/unit-scale/byte-unit-scale';

/**
 * A pipe that transforms a number of bytes into a string formatted like "1.2 kB"
 */
@Pipe({
    name: 'formatBytesSize'
})
export class FormatBytesSizePipe implements PipeTransform {
    private readonly bytesSizeFormatter;

    public constructor(@Inject(LOCALE_ID) locale: string) {
        this.bytesSizeFormatter = new DecimalUnitFormat(locale, {
            maximumFractionDigits: 1,
            unitScale: byteUnitScale
        });
    }

    public transform(size: number): string {
        return this.bytesSizeFormatter.format(size);
    }
}
