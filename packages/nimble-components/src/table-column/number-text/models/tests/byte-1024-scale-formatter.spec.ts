import { Byte1024ScaleFormatter } from '../byte-1024-scale-formatter';

describe('Byte1024ScaleFormatter', () => {
    it('formats using expected units (English)', () => {
        const formatter = new Byte1024ScaleFormatter('en', {});
        expect(formatter.formatValue(1)).toEqual('1 byte');
        expect(formatter.formatValue(2)).toEqual('2 bytes');
        expect(formatter.formatValue(1024)).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2)).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3)).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4)).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5)).toEqual('1 PiB');
    });

    it('formats using expected units (French)', () => {
        const formatter = new Byte1024ScaleFormatter('fr', {});
        expect(formatter.formatValue(1)).toEqual('1 octet');
        expect(formatter.formatValue(2)).toEqual('2 octets');
        expect(formatter.formatValue(1024)).toEqual('1 Kio');
        expect(formatter.formatValue(1024 ** 2)).toEqual('1 Mio');
        expect(formatter.formatValue(1024 ** 3)).toEqual('1 Gio');
        expect(formatter.formatValue(1024 ** 4)).toEqual('1 Tio');
        expect(formatter.formatValue(1024 ** 5)).toEqual('1 Pio');
    });

    it('formats using expected units (German)', () => {
        const formatter = new Byte1024ScaleFormatter('de', {});
        expect(formatter.formatValue(1)).toEqual('1 Byte');
        expect(formatter.formatValue(2)).toEqual('2 Byte');
        expect(formatter.formatValue(1024)).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2)).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3)).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4)).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5)).toEqual('1 PiB');
    });

    it('formats using expected units (Japanese)', () => {
        const formatter = new Byte1024ScaleFormatter('ja', {});
        expect(formatter.formatValue(1)).toEqual('1 バイト');
        expect(formatter.formatValue(2)).toEqual('2 バイト');
        expect(formatter.formatValue(1024)).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2)).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3)).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4)).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5)).toEqual('1 PiB');
    });

    it('formats using expected units (Chinese)', () => {
        const formatter = new Byte1024ScaleFormatter('zh', {});
        expect(formatter.formatValue(1)).toEqual('1 字节');
        expect(formatter.formatValue(2)).toEqual('2 字节');
        expect(formatter.formatValue(1024)).toEqual('1 KiB');
        expect(formatter.formatValue(1024 ** 2)).toEqual('1 MiB');
        expect(formatter.formatValue(1024 ** 3)).toEqual('1 GiB');
        expect(formatter.formatValue(1024 ** 4)).toEqual('1 TiB');
        expect(formatter.formatValue(1024 ** 5)).toEqual('1 PiB');
    });
});
