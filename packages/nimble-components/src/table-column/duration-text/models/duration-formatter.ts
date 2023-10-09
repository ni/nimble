/**
 * A class for formatting a numeric value in the unit of seconds into a display value representing its
 *  days, hours, minutes, and seconds.
 */
export class DurationFormatter {
    private readonly daysFormatter: Intl.NumberFormat;
    private readonly hoursFormatter: Intl.NumberFormat;
    private readonly minutesFormatter: Intl.NumberFormat;
    private readonly secondsFormatter: Intl.NumberFormat;

    public constructor(private readonly lang: string) {
        this.daysFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'day' });
        this.hoursFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'hour' });
        this.minutesFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'minute' });
        this.secondsFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'second' });
    }

    public format(value: number | null | undefined): string {
        if (value === null || value === undefined) {
            return '';
        }

        const result = [];
        const days = Math.floor(value / 86400);
        if (days) {
            const formattedDays = this.daysFormatter.format(days);
            result.push(formattedDays);
        }

        const hours = Math.floor((value / 86400) * 24);
        if (hours) {
            const formattedHours = this.hoursFormatter.format(hours);
            result.push(formattedHours);
        }

        const secondsRemainingWithoutHours = (value % 3600);
        const minutes = Math.floor(secondsRemainingWithoutHours / 60);
        if (minutes) {
            const formattedMinutes = this.minutesFormatter.format(minutes);
            result.push(formattedMinutes);
        }

        const seconds = (secondsRemainingWithoutHours % 60);
        if (seconds || value === 0) {
            const formattedSeconds = this.secondsFormatter.format(seconds);
            result.push(formattedSeconds);
        }

        return result.join(', ');
    }
}
