import { parameterizeSpec } from '@ni/jasmine-parameterized';
import { DateTextFormatter } from '../date-text-formatter';
import type { SupportedDateTimeFormatOptions } from '../../types';

describe('DateTextFormatter', () => {
    const formatter = new DateTextFormatter('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    it('formats a numeric timestamp', () => {
        expect(formatter.format(Date.UTC(2020, 0, 2))).toBe('01/02/2020');
    });

    describe('returns an empty string for invalid values', () => {
        const values = [
            { name: 'null', value: null },
            { name: 'undefined', value: undefined },
            { name: 'NaN', value: Number.NaN },
            { name: 'positive infinity', value: Number.POSITIVE_INFINITY },
            { name: 'negative infinity', value: Number.NEGATIVE_INFINITY },
            { name: 'invalid Date instance', value: new Date('not a date') }
        ] as const;
        parameterizeSpec(values, (spec, name, value) => {
            spec(name, () => {
                expect(formatter.format(value.value)).toBe('');
            });
        });
    });

    it('formats using the requested locale', () => {
        const germanFormatter = new DateTextFormatter('de-DE', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        expect(germanFormatter.format(Date.UTC(2020, 0, 2))).toBe('02.01.2020');
    });

    it('ignores unsupported options when formatting', () => {
        const timeOptions: SupportedDateTimeFormatOptions = {
            timeZone: 'UTC',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const withUnsupportedOption = new DateTextFormatter('en-US', {
            ...timeOptions,
            notReal: 3
        } as SupportedDateTimeFormatOptions);
        const withoutUnsupportedOption = new DateTextFormatter('en-US', timeOptions);
        const value = Date.UTC(2020, 0, 2, 3, 4, 5, 678);

        expect(withUnsupportedOption.format(value)).toBe(
            withoutUnsupportedOption.format(value)
        );
    });

    it('ignores unsupported options when matching', () => {
        const formatterWithSupportedOptions = new DateTextFormatter('en-US', {
            year: 'numeric'
        });
        const targetWithUnsupportedOption = {
            year: 'numeric',
            fractionalSecondDigits: 3
        } as SupportedDateTimeFormatOptions;

        expect(
            formatterWithSupportedOptions.optionsMatch(targetWithUnsupportedOption)
        ).toBeTrue();
    });

    describe('parses number and Date inputs consistently', () => {
        const utcFormatter = new DateTextFormatter('en-US', {
            timeZone: 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        it('formats a Date instance identically to its epoch milliseconds', () => {
            const epoch = Date.UTC(2020, 0, 2, 3, 4, 5);
            expect(utcFormatter.format(new Date(epoch))).toBe(
                utcFormatter.format(epoch)
            );
        });

        it('formats the Unix epoch (zero)', () => {
            expect(utcFormatter.format(0)).toBe('01/01/1970, 00:00:00');
        });

        it('formats a negative timestamp before the Unix epoch', () => {
            expect(utcFormatter.format(-1000)).toBe('12/31/1969, 23:59:59');
        });
    });
});