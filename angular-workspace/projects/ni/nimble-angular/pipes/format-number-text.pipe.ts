import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { NumberTextUnitFormat, NumberTextUnitFormatOptions } from '@ni/nimble-components/dist/esm/table-column/number-text/models/number-text-unit-format';

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

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: number, options?: NumberTextUnitFormatOptions): string {
        if (!this.numberTextUnitFormat?.optionsMatch(options)) {
            this.numberTextUnitFormat = new NumberTextUnitFormat(this.locale, options);
        }
        return this.numberTextUnitFormat.format(value);
    }
}
