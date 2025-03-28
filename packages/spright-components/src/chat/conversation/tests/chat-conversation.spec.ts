import { html } from '@ni/fast-element';
import { ChatConversation, chatConversationTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';

async function setup(): Promise<Fixture<ChatConversation>> {
    return await fixture<ChatConversation>(
        html`<${chatConversationTag}></${chatConversationTag}>`
    );
}

describe('ChatConversation', () => {
    let element: ChatConversation;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
    });

    afterEach(async () => {
        await disconnect();
    });

    it('can construct an element instance', () => {
        expect(document.createElement(chatConversationTag)).toBeInstanceOf(
            ChatConversation
        );
    });

    it('should have a slot element in the shadow DOM', async () => {
        await connect();
        expect(element.shadowRoot?.querySelector('SLOT')).not.toBeNull();
    });
});
