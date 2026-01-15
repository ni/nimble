import { Inject, LOCALE_ID, Pipe, type PipeTransform } from '@angular/core';
import { UnitFormatNumberText, type UnitFormatNumberTextOptions } from '@ni/nimble-components/dist/esm/table-column/number-text/models/unit-format-number-text';

/**
 * A pipe that transforms a number into a string with optional unit
 */
@Pipe({
    name: 'numberText',
    standalone: true
})
export class NumberTextPipe implements PipeTransform {
    /**
     * @internal
     */
    public unitFormatNumberText?: UnitFormatNumberText;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(value: number, options?: UnitFormatNumberTextOptions): string {
        if (!this.unitFormatNumberText?.optionsMatch(options)) {
            this.unitFormatNumberText = new UnitFormatNumberText(this.locale, options);
        }
        return this.unitFormatNumberText.format(value);
    }
}
