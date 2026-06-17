import { html } from '@ni/fast-element';
import { processUpdates } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { anchorTag } from '@ni/nimble-components/dist/esm/anchor';
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

    it('should have a start slot element in the shadow DOM', async () => {
        await connect();
        const startSlot = element.shadowRoot?.querySelector('slot[name="start"]');
        expect(startSlot).not.toBeNull();
    });

    it('should have an end slot element in the shadow DOM', async () => {
        await connect();
        const endSlot = element.shadowRoot?.querySelector('slot[name="end"]');
        expect(endSlot).not.toBeNull();
    });

    it('should support content in the end slot', async () => {
        await disconnect();
        ({ element, connect, disconnect } = await fixture<ChatConversation>(
            html`<${chatConversationTag}>
                <span slot="end">
                    AI-generated content may be incorrect. 
                    <${anchorTag} href="https://www.ni.com" target="_blank">View Terms and Conditions</${anchorTag}>
                </span>
            </${chatConversationTag}>`
        ));
        await connect();
        const endSlot: HTMLSlotElement = element.shadowRoot!.querySelector('slot[name="end"]')!;
        expect(endSlot.assignedElements().length).toBe(1);
    });

    describe('scrolling behavior', () => {
        it('auto-scroll should default to false', async () => {
            await connect();
            expect(element.autoScroll).toBeFalse();
        });

        it('can enable auto-scroll before connect', async () => {
            element.autoScroll = true;

            await connect();

            const scrollManager = (element as unknown as { scrollManager: unknown }).scrollManager;
            expect(scrollManager).not.toBeNull();
        });

        it('can toggle auto-scroll on and off while connected', async () => {
            await connect();

            element.autoScroll = true;
            processUpdates();
            const withAutoScroll = (element as unknown as { scrollManager: unknown }).scrollManager;
            expect(withAutoScroll).not.toBeNull();

            element.autoScroll = false;
            processUpdates();
            const withoutAutoScroll = (element as unknown as { scrollManager: unknown }).scrollManager;
            expect(withoutAutoScroll).toBeNull();
        });
    });
});
