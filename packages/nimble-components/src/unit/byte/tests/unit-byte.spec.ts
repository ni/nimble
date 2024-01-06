import { html } from '@microsoft/fast-element';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { UnitByte, unitByteTag } from '..';
import { byte1024UnitScale } from '../../../utilities/unit-format/manually-translated-unit-scale/byte-1024-unit-scale';
import { byteUnitScale } from '../../../utilities/unit-format/unit-scale/byte-unit-scale';

async function setup(binary: boolean): Promise<Fixture<UnitByte>> {
    return fixture<UnitByte>(html`
        <nimble-unit-byte ?binary="${() => binary}"></nimble-unit-byte>
    `);
}

describe('Byte unit', () => {
    let element: UnitByte;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    it('should export its tag', () => {
        expect(unitByteTag).toBe('nimble-unit-byte');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-byte')).toBeInstanceOf(
            UnitByte
        );
    });

    it('returns Byte1024UnitScale when "binary" attribute is set', async () => {
        ({ element, connect, disconnect } = await setup(true));
        await connect();
        expect(element.getUnitScale()).toBe(byte1024UnitScale);
        await disconnect();
    });

    it('returns ByteScale when "binary" attribute is unset', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        expect(element.getUnitScale()).toBe(byteUnitScale);
        await disconnect();
    });
});
