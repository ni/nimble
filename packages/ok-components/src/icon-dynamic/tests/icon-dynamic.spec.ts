import { html } from '@ni/fast-element';
import { IconDynamic, iconDynamicTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<IconDynamic>> {
    return await fixture<IconDynamic>(html`<${iconDynamicTag}></${iconDynamicTag}>`);
}

describe('IconDynamic', () => {
    let element: IconDynamic;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(iconDynamicTag)).toBeInstanceOf(IconDynamic);
    });

    it('should have an empty shadow dom', async () => {
        await connect();
        expect(element.shadowRoot?.childNodes.length).toBe(0);
    });
});
