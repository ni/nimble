import { Byte1024UnitScaleFormatter } from '../byte-1024-unit-scale-formatter';

describe('Byte1024UnitScaleFormatter', () => {
    it('formats using expected units (English)', () => {
        const formatter = new Byte1024UnitScaleFormatter('en', {});
        expect(formatter.formatValue(0).string).toEqual('0 bytes');
        expect(formatter.formatValue(1).string).toEqual('1 byte');
        expect(formatter.formatValue(2).string).toEqual('2 bytes');
        expect(formatter.formatValue(1024).string).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2).string).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3).string).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4).string).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5).string).toEqual('1 PiB');
        expect(formatter.formatValue(1024 ** 6).string).toEqual('1,024 PiB');
    });

    it('formats using expected units (French)', () => {
        const formatter = new Byte1024UnitScaleFormatter('fr', {});
        expect(formatter.formatValue(0).string).toEqual('0 octet');
        expect(formatter.formatValue(1).string).toEqual('1 octet');
        expect(formatter.formatValue(2).string).toEqual('2 octets');
        expect(formatter.formatValue(1024).string).toEqual('1 Kio');
        expect(formatter.formatValue(1024 ** 2).string).toEqual('1 Mio');
        expect(formatter.formatValue(1024 ** 3).string).toEqual('1 Gio');
        expect(formatter.formatValue(1024 ** 4).string).toEqual('1 Tio');
        expect(formatter.formatValue(1024 ** 5).string).toEqual('1 Pio');
        expect(formatter.formatValue(1024 ** 6).string).toEqual(
            '1\u202f024 Pio'
        );
    });

    it('formats using expected units (German)', () => {
        const formatter = new Byte1024UnitScaleFormatter('de', {});
        expect(formatter.formatValue(0).string).toEqual('0 Byte');
        expect(formatter.formatValue(1).string).toEqual('1 Byte');
        expect(formatter.formatValue(2).string).toEqual('2 Byte');
        expect(formatter.formatValue(1024).string).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2).string).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3).string).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4).string).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5).string).toEqual('1 PiB');
        expect(formatter.formatValue(1024 ** 6).string).toEqual('1.024 PiB');
    });

    it('formats using expected units (Japanese)', () => {
        const formatter = new Byte1024UnitScaleFormatter('ja', {});
        expect(formatter.formatValue(0).string).toEqual('0 バイト');
        expect(formatter.formatValue(1).string).toEqual('1 バイト');
        expect(formatter.formatValue(2).string).toEqual('2 バイト');
        expect(formatter.formatValue(1024).string).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2).string).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3).string).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4).string).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5).string).toEqual('1 PiB');
        expect(formatter.formatValue(1024 ** 6).string).toEqual('1,024 PiB');
    });

    it('formats using expected units (Chinese)', () => {
        const formatter = new Byte1024UnitScaleFormatter('zh', {});
        expect(formatter.formatValue(0).string).toEqual('0 字节');
        expect(formatter.formatValue(1).string).toEqual('1 字节');
        expect(formatter.formatValue(2).string).toEqual('2 字节');
        expect(formatter.formatValue(1024).string).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2).string).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3).string).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4).string).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5).string).toEqual('1 PiB');
        expect(formatter.formatValue(1024 ** 6).string).toEqual('1,024 PiB');
    });
});
