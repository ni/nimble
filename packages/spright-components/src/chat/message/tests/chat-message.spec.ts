import { html } from '@microsoft/fast-element';
import { ChatMessage, chatMessageTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatMessage>> {
    return await fixture<ChatMessage>(
        html`<${chatMessageTag}></${chatMessageTag}>`
    );
}

describe('ChatMessage', () => {
    let element: ChatMessage;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatMessageTag)).toBeInstanceOf(ChatMessage);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
