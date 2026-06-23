import { html } from '@ni/fast-element';
import { processUpdates } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { anchorTag } from '@ni/nimble-components/dist/esm/anchor';
import { ChatConversation, chatConversationTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatConversationPageObject } from '../testing/chat-conversation.pageobject';

async function setup(): Promise<Fixture<ChatConversation>> {
    return await fixture<ChatConversation>(
        html`<${chatConversationTag}></${chatConversationTag}>`
    );
}

describe('ChatConversation', () => {
    let element: ChatConversation;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: ChatConversationPageObject;

    beforeEach(async () => {
        ({ element, connect, disconnect } = await setup());
        pageObject = new ChatConversationPageObject(element);
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
        expect(pageObject.hasDefaultSlot()).toBeTrue();
    });

    it('should have an input slot element in the shadow DOM', async () => {
        await connect();
        expect(pageObject.hasNamedSlot('input')).toBeTrue();
    });

    it('should have a toolbar slot element in the shadow DOM', async () => {
        await connect();
        expect(pageObject.hasNamedSlot('toolbar')).toBeTrue();
    });

    it('should have a start slot element in the shadow DOM', async () => {
        await connect();
        expect(pageObject.hasNamedSlot('start')).toBeTrue();
    });

    it('should have an end slot element in the shadow DOM', async () => {
        await connect();
        expect(pageObject.hasNamedSlot('end')).toBeTrue();
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
        pageObject = new ChatConversationPageObject(element);
        await connect();
        expect(pageObject.getNamedSlotAssignedElementCount('end')).toBe(1);
    });

    describe('scrolling behavior', () => {
        it('auto-scroll should default to false', async () => {
            await connect();
            expect(pageObject.isAutoScrollEnabled()).toBeFalse();
        });

        it('can enable auto-scroll before connect', async () => {
            element.autoScroll = true;

            await connect();

            expect(pageObject.isAutoScrollConnected()).toBeTrue();
        });

        it('can toggle auto-scroll on and off while connected', async () => {
            await connect();

            element.autoScroll = true;
            processUpdates();
            expect(pageObject.isAutoScrollConnected()).toBeTrue();

            element.autoScroll = false;
            processUpdates();
            expect(pageObject.isAutoScrollConnected()).toBeFalse();
        });
    });
});
