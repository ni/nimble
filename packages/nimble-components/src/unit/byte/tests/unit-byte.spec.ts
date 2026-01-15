import { html } from '@ni/fast-element';
import { unitScaleByte1024 } from '@ni/unit-format/unit-scale/byte-1024';
import { unitScaleByte } from '@ni/unit-format/unit-scale/byte';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { UnitByte, unitByteTag } from '..';

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

    it('returns unitScaleByte1024 when "binary" attribute is set', async () => {
        ({ element, connect, disconnect } = await setup(true));
        await connect();
        expect(element.resolvedUnitScale).toBe(unitScaleByte1024);
        await disconnect();
    });

    it('returns ByteScale when "binary" attribute is unset', async () => {
        ({ element, connect, disconnect } = await setup(false));
        await connect();
        expect(element.resolvedUnitScale).toBe(unitScaleByte);
        await disconnect();
    });
});
