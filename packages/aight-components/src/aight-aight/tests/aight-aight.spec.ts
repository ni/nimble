import { html } from '@ni/fast-element';
import { AightAight, aightAightTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<AightAight>> {
    return await fixture<AightAight>(
        html`<${aightAightTag}></${aightAightTag}>`
    );
}

describe('AightAight', () => {
    let element: AightAight;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(aightAightTag)).toBeInstanceOf(
            AightAight
        );
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
