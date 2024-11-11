import { html } from '@microsoft/fast-element';
import { Rectangle, rectangleTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Rectangle>> {
    return await fixture<Rectangle>(
        html`<spright-rectangle></spright-rectangle>`
    );
}

describe('Rectangle', () => {
    let element: Rectangle;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(rectangleTag)).toBeInstanceOf(Rectangle);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
