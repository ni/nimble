import { ByteScaleFormatter } from '../byte-scale-formatter';

describe('ByteScaleFormatter', () => {
    it('returns expected units (English)', () => {
        const formatter = new ByteScaleFormatter('en', {});
        expect(formatter.formatValue(1)).toEqual('1 byte');
        expect(formatter.formatValue(2)).toEqual('2 bytes');
        expect(formatter.formatValue(10 ** 3)).toEqual('1 kB');
        expect(formatter.formatValue(10 ** 6)).toEqual('1 MB');
        expect(formatter.formatValue(10 ** 9)).toEqual('1 GB');
        expect(formatter.formatValue(10 ** 12)).toEqual('1 TB');
        expect(formatter.formatValue(10 ** 15)).toEqual('1 PB');
    });

    // no need to test other languages, as this formatter uses Intl.NumberFormat

    it('uses passed formatter options', () => {
        const formatter = new ByteScaleFormatter('en', {
            minimumIntegerDigits: 2
        });
        expect(formatter.formatValue(1)).toEqual('01 byte');
    });
});
