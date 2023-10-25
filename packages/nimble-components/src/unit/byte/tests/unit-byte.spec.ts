import { html } from '@microsoft/fast-element';
import { type Fixture, fixture } from '../../../utilities/tests/fixture';
import { UnitByte, unitByteTag } from '..';
import { Byte1024UnitScaleFormatter } from '../models/byte-1024-unit-scale-formatter';
import { ByteUnitScaleFormatter } from '../models/byte-unit-scale-formatter';

async function setup(): Promise<Fixture<UnitByte>> {
    return fixture<UnitByte>(html`
        <nimble-unit-byte binary></nimble-unit-byte>
    `);
}

describe('Byte unit', () => {
    let element: UnitByte;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        await connect();
    });

    afterEach(async () => {
        await disconnect();
    });

    it('should export its tag', () => {
        expect(unitByteTag).toBe('nimble-unit-byte');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-unit-byte')).toBeInstanceOf(
            UnitByte
        );
    });

    it('honors "binary" attribute', () => {
        expect(element.getFormatter()).toBe(Byte1024UnitScaleFormatter);
    });

    it('returns ByteScaleFormatter when "binary" is false', () => {
        element.binary = false;
        expect(element.getFormatter()).toBe(ByteUnitScaleFormatter);
    });
});
