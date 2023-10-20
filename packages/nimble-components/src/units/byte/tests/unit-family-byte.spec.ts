import { html } from '@microsoft/fast-element';
import { UnitFamilyByte, unitByteTag } from '..';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import type { Unit } from '../../base/unit-family';

async function setup(binary: boolean): Promise<Fixture<UnitFamilyByte>> {
    return fixture<UnitFamilyByte>(html`
        <${unitByteTag} ?binary="${() => binary}"></${unitByteTag}>
    `);
}

const compareConversionFactor = (a: Unit, b: Unit): number => {
    return a.conversionFactor < b.conversionFactor ? -1 : 1;
};

describe('Byte unit', () => {
    let element: UnitFamilyByte;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    it('should export its tag', () => {
        expect(unitByteTag).toBe('nimble-unit-byte');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-byte')).toBeInstanceOf(
            UnitFamilyByte
        );
    });

    describe('binary=false', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup(false));
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('returns expected units (English)', () => {
            const units = element
                .getSupportedUnits('en', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 byte');
            expect(units[0]?.format(2)).toEqual('2 bytes');
            expect(units[1]?.conversionFactor).toEqual(1000);
            expect(units[1]?.format(1)).toEqual('1 kB');
            expect(units[2]?.conversionFactor).toEqual(10 ** 6);
            expect(units[2]?.format(1)).toEqual('1 MB');
            expect(units[3]?.conversionFactor).toEqual(10 ** 9);
            expect(units[3]?.format(1)).toEqual('1 GB');
            expect(units[4]?.conversionFactor).toEqual(10 ** 12);
            expect(units[4]?.format(1)).toEqual('1 TB');
            expect(units[5]?.conversionFactor).toEqual(10 ** 15);
            expect(units[5]?.format(1)).toEqual('1 PB');
        });

        // no need to test other languages, as this mode uses Intl.NumberFormat

        it('uses passed formatter options', () => {
            const units = element
                .getSupportedUnits('en', { minimumIntegerDigits: 2 })
                .sort(compareConversionFactor);
            expect(units[0]?.format(1)).toEqual('01 byte');
        });
    });

    describe('binary=true', () => {
        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup(true));
            await connect();
        });

        afterEach(async () => {
            await disconnect();
        });

        it('returns expected units (English)', () => {
            const units = element
                .getSupportedUnits('en', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 byte');
            expect(units[0]?.format(2)).toEqual('2 bytes');
            expect(units[1]?.conversionFactor).toEqual(1024);
            expect(units[1]?.format(1)).toEqual('1 KiB');
            expect(units[2]?.conversionFactor).toEqual(1024 ** 2);
            expect(units[2]?.format(1)).toEqual('1 MiB');
            expect(units[3]?.conversionFactor).toEqual(1024 ** 3);
            expect(units[3]?.format(1)).toEqual('1 GiB');
            expect(units[4]?.conversionFactor).toEqual(1024 ** 4);
            expect(units[4]?.format(1)).toEqual('1 TiB');
            expect(units[5]?.conversionFactor).toEqual(1024 ** 5);
            expect(units[5]?.format(1)).toEqual('1 PiB');
        });

        it('returns expected units (French)', () => {
            const units = element
                .getSupportedUnits('fr', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 octet');
            expect(units[0]?.format(2)).toEqual('2 octets');
            expect(units[1]?.conversionFactor).toEqual(1024);
            expect(units[1]?.format(1)).toEqual('1 Kio');
            expect(units[2]?.conversionFactor).toEqual(1024 ** 2);
            expect(units[2]?.format(1)).toEqual('1 Mio');
            expect(units[3]?.conversionFactor).toEqual(1024 ** 3);
            expect(units[3]?.format(1)).toEqual('1 Gio');
            expect(units[4]?.conversionFactor).toEqual(1024 ** 4);
            expect(units[4]?.format(1)).toEqual('1 Tio');
            expect(units[5]?.conversionFactor).toEqual(1024 ** 5);
            expect(units[5]?.format(1)).toEqual('1 Pio');
        });

        it('returns expected units (German)', () => {
            const units = element
                .getSupportedUnits('de', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 Byte');
            expect(units[0]?.format(2)).toEqual('2 Byte');
            expect(units[1]?.conversionFactor).toEqual(1024);
            expect(units[1]?.format(1)).toEqual('1 KiB');
            expect(units[2]?.conversionFactor).toEqual(1024 ** 2);
            expect(units[2]?.format(1)).toEqual('1 MiB');
            expect(units[3]?.conversionFactor).toEqual(1024 ** 3);
            expect(units[3]?.format(1)).toEqual('1 GiB');
            expect(units[4]?.conversionFactor).toEqual(1024 ** 4);
            expect(units[4]?.format(1)).toEqual('1 TiB');
            expect(units[5]?.conversionFactor).toEqual(1024 ** 5);
            expect(units[5]?.format(1)).toEqual('1 PiB');
        });

        it('returns expected units (Japanese)', () => {
            const units = element
                .getSupportedUnits('ja', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 バイト');
            expect(units[0]?.format(2)).toEqual('2 バイト');
            expect(units[1]?.conversionFactor).toEqual(1024);
            expect(units[1]?.format(1)).toEqual('1 KiB');
            expect(units[2]?.conversionFactor).toEqual(1024 ** 2);
            expect(units[2]?.format(1)).toEqual('1 MiB');
            expect(units[3]?.conversionFactor).toEqual(1024 ** 3);
            expect(units[3]?.format(1)).toEqual('1 GiB');
            expect(units[4]?.conversionFactor).toEqual(1024 ** 4);
            expect(units[4]?.format(1)).toEqual('1 TiB');
            expect(units[5]?.conversionFactor).toEqual(1024 ** 5);
            expect(units[5]?.format(1)).toEqual('1 PiB');
        });

        it('returns expected units (Chinese)', () => {
            const units = element
                .getSupportedUnits('zh', {})
                .sort(compareConversionFactor);
            expect(units.length).toEqual(6);
            expect(units[0]?.conversionFactor).toEqual(1);
            expect(units[0]?.format(1)).toEqual('1 字节');
            expect(units[0]?.format(2)).toEqual('2 字节');
            expect(units[1]?.conversionFactor).toEqual(1024);
            expect(units[1]?.format(1)).toEqual('1 KiB');
            expect(units[2]?.conversionFactor).toEqual(1024 ** 2);
            expect(units[2]?.format(1)).toEqual('1 MiB');
            expect(units[3]?.conversionFactor).toEqual(1024 ** 3);
            expect(units[3]?.format(1)).toEqual('1 GiB');
            expect(units[4]?.conversionFactor).toEqual(1024 ** 4);
            expect(units[4]?.format(1)).toEqual('1 TiB');
            expect(units[5]?.conversionFactor).toEqual(1024 ** 5);
            expect(units[5]?.format(1)).toEqual('1 PiB');
        });
    });
});
