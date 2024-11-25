import { html } from '@microsoft/fast-element';
import { AIChatTextBubble, aiChatTextBubbleTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';

async function setup(): Promise<Fixture<AIChatTextBubble>> {
    return await fixture<AIChatTextBubble>(
        html`<${aiChatTextBubbleTag}></${aiChatTextBubbleTag}>`
    );
}

describe('AIChatTextBubble', () => {
    let element: AIChatTextBubble;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(aiChatTextBubbleTag)).toBeInstanceOf(AIChatTextBubble);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
