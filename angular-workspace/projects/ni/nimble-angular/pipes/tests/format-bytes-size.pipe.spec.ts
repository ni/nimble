import { FormatBytesSizePipe } from '../format-bytes-size.pipe';

describe('FormatBytesSizePipe', () => {
    describe('basic formatting (English)', () => {
        const pipe = new FormatBytesSizePipe('en');

        const testCases = [
            {
                name: 'should return the expected format for 0 bytes',
                value: 0,
                expected: '0 bytes'
            },
            {
                name: 'should return the expected format for 1 byte',
                value: 1,
                expected: '1 byte'
            },
            {
                name: 'should return the expected size in bytes',
                value: 435,
                expected: '435 bytes'
            },
            {
                name: 'should return the expected size in kB with no decimals',
                value: 300000,
                expected: '300 kB'
            },
            {
                name: 'should return the expected size in kB with one decimal',
                value: 648445,
                expected: '648.4 kB'
            },
            {
                name: 'should return the expected size in MB with no decimals',
                value: 2000000,
                expected: '2 MB'
            },
            {
                name: 'should return the expected size in MB with one decimal',
                value: 6221234,
                expected: '6.2 MB'
            },
            {
                name: 'should return the expected size in GB with no decimals',
                value: 2000000000,
                expected: '2 GB'
            },
            {
                name: 'should return the expected size in GB with one decimal',
                value: 3712345678,
                expected: '3.7 GB'
            },
            {
                name: 'should return the expected size in TB with one decimal',
                value: 3712345678900,
                expected: '3.7 TB'
            },
        ];

        testCases.forEach(test => {
            it(test.name, () => {
                expect(pipe.transform(test.value)).toEqual(test.expected);
            });
        });
    });

    describe('localized formatting', () => {
        it('for "de" locale, returns "2 Byte" for 2', () => {
            const pipe = new FormatBytesSizePipe('de');
            expect(pipe.transform(2)).toEqual('2 Byte');
        });
    });
});
