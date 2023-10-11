/**
 * A class for formatting a numeric value in the unit of seconds into a display value representing its
 *  days, hours, minutes, and seconds.
 */
export class DurationFormatter {
    private readonly daysFormatter: Intl.NumberFormat;
    private readonly hoursFormatter: Intl.NumberFormat;
    private readonly minutesFormatter: Intl.NumberFormat;
    private readonly secondsFormatter: Intl.NumberFormat;
    private readonly scientificSecondsFormatter: Intl.NumberFormat;

    public constructor(private readonly lang: string) {
        this.daysFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'day' });
        this.hoursFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'hour' });
        this.minutesFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'minute' });
        this.secondsFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'second' });
        this.scientificSecondsFormatter = new Intl.NumberFormat(this.lang, { style: 'unit', unit: 'second', notation: 'scientific', maximumFractionDigits: 3 });
    }

    public format(value: number | null | undefined): string {
        if (value === null || value === undefined || value < 0 || !Number.isFinite(value)) {
            return '';
        }

        const result = [];
        const fractionalDays = value / 86400000;
        const days = Math.floor(fractionalDays);
        if (days < 100 && days > 0) {
            const formattedDays = this.daysFormatter.format(days);
            result.push(formattedDays);
        } else if (days >= 100) {
            return this.scientificSecondsFormatter.format(value / 1000);
        }

        const hours = Math.floor((value / 3600000) % 24);
        if (hours) {
            const formattedHours = this.hoursFormatter.format(hours);
            result.push(formattedHours);
        }

        const minutes = Math.floor((value / 60000) % 60);
        if (minutes) {
            const formattedMinutes = this.minutesFormatter.format(minutes);
            result.push(formattedMinutes);
        }

        const seconds = ((value / 1000) % 60);
        if (seconds || value === 0 || Object.is(value, -0)) {
            const formattedSeconds = this.secondsFormatter.format(seconds);
            result.push(formattedSeconds);
        } else if (value > 0 && result.length === 0) {
            return this.scientificSecondsFormatter.format(value / 1000);
        }

        return result.join(', ');
    }
}
