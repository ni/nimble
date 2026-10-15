import { Inject, LOCALE_ID, Pipe, type PipeTransform } from '@angular/core';
import { DateTextFormatter } from '@ni/nimble-components/dist/esm/table-column/date-text/models/date-text-formatter';
import type { SupportedIntlDateTimeFormatOptions } from '@ni/nimble-components/dist/esm/table-column/date-text/types';

/**
 * A pipe that transforms date values into localized date strings.
 */
@Pipe({
    name: 'dateText',
    standalone: true
})
export class DateTextPipe implements PipeTransform {
    private dateTextFormatter?: DateTextFormatter;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(
        value: Date | number | null | undefined,
        options?: SupportedIntlDateTimeFormatOptions
    ): string {
        if (!this.dateTextFormatter?.optionsMatch(options)) {
            this.dateTextFormatter = new DateTextFormatter(this.locale, options);
        }
        return this.dateTextFormatter.format(value);
    }
}