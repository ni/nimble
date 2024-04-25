import { html } from '@microsoft/fast-element';
import { Rectangle, rectangleTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<Rectangle>> {
    return fixture<Rectangle>(html`<spright-rectangle></spright-rectangle>`);
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

    it('should export its tag', () => {
        expect(rectangleTag).toBe('spright-rectangle');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('spright-rectangle')).toBeInstanceOf(
            Rectangle
        );
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
