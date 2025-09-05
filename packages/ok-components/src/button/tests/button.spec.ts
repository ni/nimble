import { html } from '@ni/fast-element';
import { Button, buttonTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Button>> {
    return await fixture<Button>(
        html`<${buttonTag}></${buttonTag}>`
    );
}

describe('Button', () => {
    let element: Button;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(buttonTag)).toBeInstanceOf(
            Button
        );
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
