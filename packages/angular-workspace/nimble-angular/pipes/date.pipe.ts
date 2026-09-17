import { Inject, LOCALE_ID, Pipe, type PipeTransform } from '@angular/core';
import { DateFormatter } from '@ni/nimble-components/dist/esm/table-column/date-text/models/date-formatter';
import type { SupportedDateTimeFormatOptions } from '@ni/nimble-components/dist/esm/table-column/date-text/types';

/**
 * A pipe that transforms date values into localized date strings.
 */
@Pipe({
    name: 'nimbleDate',
    standalone: true
})
export class DatePipe implements PipeTransform {
    private dateFormatter?: DateFormatter;

    public constructor(@Inject(LOCALE_ID) private readonly locale: string) {}

    public transform(
        value: Date | number | null | undefined,
        options?: SupportedDateTimeFormatOptions
    ): string {
        if (!this.dateFormatter?.optionsMatch(options)) {
            this.dateFormatter = new DateFormatter(this.locale, options);
        }
        return this.dateFormatter.format(value);
    }
}