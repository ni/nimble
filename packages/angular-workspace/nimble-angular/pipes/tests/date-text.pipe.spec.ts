import { DateTextPipe } from '../date-text.pipe';

describe('DateTextPipe', () => {
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'UTC',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    };

    it('formats numeric and Date values', () => {
        const pipe = new DateTextPipe('en-US');
        const timestamp = Date.UTC(2020, 0, 2);

        expect(pipe.transform(timestamp, options)).toBe('01/02/2020');
        expect(pipe.transform(new Date(timestamp), options)).toBe('01/02/2020');
    });

    it('returns an empty string for invalid values', () => {
        const pipe = new DateTextPipe('en-US');

        expect(pipe.transform(null, options)).toBe('');
        expect(pipe.transform(undefined, options)).toBe('');
        expect(pipe.transform(new Date('not a date'), options)).toBe('');
    });

    it('formats using the injected locale', () => {
        const pipe = new DateTextPipe('de-DE');

        expect(pipe.transform(Date.UTC(2020, 0, 2), options)).toBe('02.01.2020');
    });
});