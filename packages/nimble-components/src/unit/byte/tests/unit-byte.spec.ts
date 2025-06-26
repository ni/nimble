import { html } from '@ni/fast-element';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { UnitByte, unitByteTag } from '..';
import { byte1024UnitScale } from '../../../utilities/unit-format/unit-scale/byte-1024-unit-scale';
import { byteUnitScale } from '../../../utilities/unit-format/unit-scale/byte-unit-scale';

async function setup(binary: boolean): Promise<Fixture<UnitByte>> {
    return await fixture<UnitByte>(html`
        <${unitByteTag} ?binary="${() => binary}"></${unitByteTag}>
    `);
}

describe('Byte unit', () => {
    let element: UnitByte;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    it('can construct an element instance', () => {
        expect(document.createElement(unitByteTag)).toBeInstanceOf(UnitByte);
    });

    it('returns Byte1024UnitScale when "binary" attribute is set', async () => {
        ({ element, connect, disconnect } = await setup(true));
        await connect();
        expect(element.resolvedUnitScale).toBe(byte1024UnitScale);
        await disconnect();
    });

    it('returns ByteScale when "binary" attribute is unset', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        expect(element.resolvedUnitScale).toBe(byteUnitScale);
        await disconnect();
    });
});
