import {
    supportedIntlDateTimeFormatOptionNames,
    type SupportedIntlDateTimeFormatOptions
} from '../types';

/**
 * A class for formatting date values using the provided locale and options.
 */
export class DateTextFormatter {
    private static readonly defaultOptions: SupportedIntlDateTimeFormatOptions = {
        dateStyle: 'medium',
        timeStyle: 'medium'
    } as const;

    private readonly formatter: Intl.DateTimeFormat;
    private readonly options: SupportedIntlDateTimeFormatOptions;

    public constructor(
        lang: string,
        options?: SupportedIntlDateTimeFormatOptions
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

    public optionsMatch(targetOptions?: SupportedIntlDateTimeFormatOptions): boolean {
        const resolvedTargetOptions = targetOptions ?? DateTextFormatter.defaultOptions;
        for (const name of supportedIntlDateTimeFormatOptionNames) {
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
        options: SupportedIntlDateTimeFormatOptions | undefined
    ): SupportedIntlDateTimeFormatOptions {
        if (options === undefined) {
            return DateTextFormatter.defaultOptions;
        }
        const supportedOptions: SupportedIntlDateTimeFormatOptions = {};
        for (const name of supportedIntlDateTimeFormatOptionNames) {
            this.resolveOption(supportedOptions, options, name);
        }
        return supportedOptions;
    }

    private resolveOption<
        TKey extends keyof SupportedIntlDateTimeFormatOptions
    >(
        target: SupportedIntlDateTimeFormatOptions,
        source: SupportedIntlDateTimeFormatOptions,
        name: TKey
    ): void {
        if (source[name] !== undefined) {
            target[name] = source[name];
        }
    }
}
