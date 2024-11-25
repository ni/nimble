import { html } from '@microsoft/fast-element';
import { ChatTextBubble, chatTextBubbleTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatTextBubble>> {
    return await fixture<ChatTextBubble>(
        html`<${chatTextBubbleTag}></${chatTextBubbleTag}>`
    );
}

describe('ChatTextBubble', () => {
    let element: ChatTextBubble;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatTextBubbleTag)).toBeInstanceOf(ChatTextBubble);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
