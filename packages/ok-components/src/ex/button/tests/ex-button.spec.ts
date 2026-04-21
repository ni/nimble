import { html } from '@ni/fast-element';
import { ExButton, exButtonTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ExButton>> {
    return await fixture<ExButton>(html`<${exButtonTag}></${exButtonTag}>`);
}

describe('Button', () => {
    let element: ExButton;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(exButtonTag)).toBeInstanceOf(ExButton);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
