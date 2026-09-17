import {
    supportedDateTimeFormatOptionNames,
    type SupportedDateTimeFormatOptions
} from '../types';

/**
 * A class for formatting date values using the provided locale and options.
 */
export class DateTextFormatter {
    private static readonly defaultOptions: SupportedDateTimeFormatOptions = {
        dateStyle: 'medium',
        timeStyle: 'medium'
    } as const;

    private readonly formatter: Intl.DateTimeFormat;
    private readonly options: SupportedDateTimeFormatOptions;

    public constructor(
        lang: string,
        options?: SupportedDateTimeFormatOptions
    ) {
        this.options = this.resolveOptions(options);
        this.formatter = new Intl.DateTimeFormat(lang, this.options);
    }

    public format(value: Date | number | null | undefined): string {
        const milliseconds = this.parseValue(value);
        if (milliseconds === undefined || !Number.isFinite(milliseconds)) {
            return '';
        }

        try {
            return this.formatter.format(milliseconds);
        } catch (_e) {
            return '';
        }
    }

    public optionsMatch(targetOptions?: SupportedDateTimeFormatOptions): boolean {
        const resolvedTargetOptions = targetOptions ?? DateTextFormatter.defaultOptions;
        for (const name of supportedDateTimeFormatOptionNames) {
            if (this.options[name] !== resolvedTargetOptions[name]) {
                return false;
            }
        }
        return true;
    }

    private parseValue(value: Date | number | null | undefined): number | undefined {
        if (value instanceof Date) {
            return value.getTime();
        }
        if (typeof value === 'number') {
            return value;
        }
        return undefined;
    }

    private resolveOptions(
        options: SupportedDateTimeFormatOptions | undefined
    ): SupportedDateTimeFormatOptions {
        if (options === undefined) {
            return DateTextFormatter.defaultOptions;
        }
        const supportedOptions: SupportedDateTimeFormatOptions = {};
        for (const name of supportedDateTimeFormatOptionNames) {
            this.resolvedOption(supportedOptions, options, name);
        }
        return supportedOptions;
    }

    private resolvedOption<
        TKey extends keyof SupportedDateTimeFormatOptions
    >(
        target: SupportedDateTimeFormatOptions,
        source: SupportedDateTimeFormatOptions,
        name: TKey
    ): void {
        if (source[name] !== undefined) {
            target[name] = source[name];
        }
    }
}
