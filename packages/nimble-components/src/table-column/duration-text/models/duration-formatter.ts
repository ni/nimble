/**
 * A class for formatting a numeric value in the unit of milliseconds into a display value representing its
 *  days, hours, minutes, and seconds.
 */
export class DurationFormatter {
    private readonly daysFormatter: Intl.NumberFormat;
    private readonly hoursFormatter: Intl.NumberFormat;
    private readonly minutesFormatter: Intl.NumberFormat;
    private readonly secondsFormatter: Intl.NumberFormat;
    private readonly scientificSecondsFormatter: Intl.NumberFormat;

    public constructor(private readonly lang: string) {
        this.daysFormatter = new Intl.NumberFormat(this.lang, {
            style: 'unit',
            unit: 'day'
        });
        this.hoursFormatter = new Intl.NumberFormat(this.lang, {
            style: 'unit',
            unit: 'hour'
        });
        this.minutesFormatter = new Intl.NumberFormat(this.lang, {
            style: 'unit',
            unit: 'minute'
        });
        this.secondsFormatter = new Intl.NumberFormat(this.lang, {
            style: 'unit',
            unit: 'second'
        });
        this.scientificSecondsFormatter = new Intl.NumberFormat(this.lang, {
            style: 'unit',
            unit: 'second',
            notation: 'scientific',
            maximumFractionDigits: 3
        });
    }

    public format(milliseconds: number | null | undefined): string {
        if (
            typeof milliseconds !== 'number'
            || milliseconds < 0
            || !Number.isFinite(milliseconds)
        ) {
            return '';
        }

        const result = [];
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = millisecondsPerSecond * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
        const fractionalDays = milliseconds / millisecondsPerDay;
        let remainingTime = milliseconds;
        const days = Math.floor(fractionalDays);
        if (days <= 999 && days > 0) {
            const formattedDays = this.daysFormatter.format(days);
            result.push(formattedDays);
            remainingTime -= days * millisecondsPerDay;
        } else if (days > 999) {
            return this.scientificSecondsFormatter.format(
                milliseconds / millisecondsPerSecond
            );
        }

        const hours = Math.floor((milliseconds / millisecondsPerHour) % 24);
        remainingTime -= hours * millisecondsPerHour;
        if (hours) {
            const formattedHours = this.hoursFormatter.format(hours);
            result.push(formattedHours);
        }

        const minutes = Math.floor((milliseconds / millisecondsPerMinute) % 60);
        remainingTime -= minutes * millisecondsPerMinute;
        if (minutes) {
            const formattedMinutes = this.minutesFormatter.format(minutes);
            result.push(formattedMinutes);
        }

        const valueInSeconds = remainingTime / millisecondsPerSecond;
        // if -0, coerce to 0
        const seconds = valueInSeconds === 0 ? 0 : valueInSeconds % 60;
        if (milliseconds < 1 && valueInSeconds !== 0) {
            return this.scientificSecondsFormatter.format(valueInSeconds);
        }

        if (seconds >= 0.0005 || (seconds === 0 && result.length === 0)) {
            const formattedSeconds = this.secondsFormatter.format(seconds);
            result.push(formattedSeconds);
        }

        return result.join(', ');
    }
}
