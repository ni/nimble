import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { DurationFormatter } from '@ni/nimble-components/dist/esm/table-column/duration-text/models/duration-formatter';

/**
 * A pipe that transforms a number of milliseconds (string/number) into a string formatted like "1 day, 2 hr, 3 min, 4.567 sec"
 */
@Pipe({
    name: 'duration'
})
export class DurationPipe implements PipeTransform {
    private readonly durationFormatter;

    public constructor(@Inject(LOCALE_ID) locale: string) {
        this.durationFormatter = new DurationFormatter(locale);
    }

    public transform(timeInMilliseconds: string | number | null | undefined): string {
        const milliseconds = this.parseDuration(timeInMilliseconds);
        return this.durationFormatter.format(milliseconds);
    }

    private parseDuration(duration: string | number | null | undefined): number | null | undefined {
        return typeof duration === 'string' ? parseFloat(duration) : duration;
    }
}
