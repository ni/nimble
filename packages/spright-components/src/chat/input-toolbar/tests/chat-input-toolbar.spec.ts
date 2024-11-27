import { html } from '@microsoft/fast-element';
import { ChatInputToolbar, chatInputToolbarTag } from '..';
import { fixture, Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatInputToolbar>> {
    return await fixture<ChatInputToolbar>(
        html`<${chatInputToolbarTag}></${chatInputToolbarTag}>`
    );
}

describe('ChatInputToolbar', () => {
    let element: ChatInputToolbar;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatInputToolbarTag)).toBeInstanceOf(ChatInputToolbar);
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(
            (element.shadowRoot?.childNodes.item(0) as HTMLElement).tagName
        ).toBe('SLOT');
    });
});
