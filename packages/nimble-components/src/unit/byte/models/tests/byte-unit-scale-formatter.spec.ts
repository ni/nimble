import { ByteUnitScaleFormatter } from '../byte-unit-scale-formatter';

describe('ByteUnitScaleFormatter', () => {
    it('returns expected units (English)', () => {
        const formatter = new ByteUnitScaleFormatter('en', {});
        expect(formatter.formatValue(0).string).toEqual('0 bytes');
        expect(formatter.formatValue(1).string).toEqual('1 byte');
        expect(formatter.formatValue(2).string).toEqual('2 bytes');
        expect(formatter.formatValue(10 ** 3).string).toEqual('1 kB');
        expect(formatter.formatValue(10 ** 6).string).toEqual('1 MB');
        expect(formatter.formatValue(10 ** 9).string).toEqual('1 GB');
        expect(formatter.formatValue(10 ** 12).string).toEqual('1 TB');
        expect(formatter.formatValue(10 ** 15).string).toEqual('1 PB');
    });

    // no need to test other languages, as this formatter uses Intl.NumberFormat

    it('uses passed formatter options', () => {
        const formatter = new ByteUnitScaleFormatter('en', {
            minimumIntegerDigits: 2
        });
        expect(formatter.formatValue(1).string).toEqual('01 byte');
    });
});
