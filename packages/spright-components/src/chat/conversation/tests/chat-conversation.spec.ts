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

    it('should have a default unnamed slot element in the shadow DOM', async () => {
        await connect();
        const unnamedSlot = element.shadowRoot?.querySelector('slot:not([name])');
        expect(unnamedSlot).not.toBeNull();
    });

    it('should have an input slot element in the shadow DOM', async () => {
        await connect();
        const inputSlot = element.shadowRoot?.querySelector('slot[name="input"]');
        expect(inputSlot).not.toBeNull();
    });

    it('should have a toolbar slot element in the shadow DOM', async () => {
        await connect();
        const toolbarSlot = element.shadowRoot?.querySelector('slot[name="toolbar"]');
        expect(toolbarSlot).not.toBeNull();
    });
});
