import { html } from '@microsoft/fast-element';
import { ChatWindow, chatWindowTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatWindow>> {
    return await fixture<ChatWindow>(
        html`<${chatWindowTag}></${chatWindowTag}>`
    );
}

describe('ChatWindow', () => {
    let element: ChatWindow;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatWindowTag)).toBeInstanceOf(ChatWindow);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
