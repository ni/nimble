import { DurationPipe } from '../duration.pipe';

describe('DurationPipe', () => {
    describe('basic formatting (English)', () => {
        const pipe = new DurationPipe('en');

        const testCases = [
            {
                name: 'null',
                value: null,
                expected: ''
            },
            {
                name: 'undefined',
                value: undefined,
                expected: ''
            },
            {
                name: '1d 2h 3m 4.56s (number)',
                value: (4.56 + 3 * 60 + 2 * 3600 + 1 * 24 * 3600) * 1000,
                expected: '1 day, 2 hr, 3 min, 4.56 sec'
            },
            {
                name: '1d 2h 3m 4.56s (as string "93784560")',
                value: '93784560',
                expected: '1 day, 2 hr, 3 min, 4.56 sec'
            },
        ];

        testCases.forEach(test => {
            it(`${test.name} transforms to ${test.expected}`, () => {
                const result = pipe.transform(test.value);
                expect(result).toEqual(test.expected);
            });
        });
    });

    describe('localized formatting', () => {
        it('for "de" locale, transforms "1d 2h 3m 4.56s" correctly', () => {
            const pipe = new DurationPipe('de');
            const milliseconds = (4.56 + 3 * 60 + 2 * 3600 + 1 * 24 * 3600) * 1000;
            const transform = pipe.transform(milliseconds);
            expect(transform).toEqual('1 Tg., 2 Std., 3 Min., 4,56 Sek.');
        });
    });
});
