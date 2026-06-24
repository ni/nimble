import { html } from '@ni/fast-element';
import { ChatConversation, chatConversationTag } from '..';
import { fixture, type Fixture } from '../../../utilities/tests/fixture';
import { ChatConversationPageObject } from '../testing/chat-conversation.pageobject';

async function setup(autoScroll: boolean): Promise<Fixture<ChatConversation>> {
    return autoScroll
        ? await fixture<ChatConversation>(
            html`<${chatConversationTag} auto-scroll></${chatConversationTag}>`
        )
        : await fixture<ChatConversation>(
            html`<${chatConversationTag}></${chatConversationTag}>`
        );
}

// Verifies how the conversation partitions messages into the history region
// (everything before the latest anchor) and the anchored region (the latest
// anchor and everything after it), and how the anchored region reserves space.
describe('ChatConversation message regions', () => {
    const viewportHeight = 150;

    let element: ChatConversation;
    let connect: () => Promise<void>;
    let disconnect: () => Promise<void>;
    let pageObject: ChatConversationPageObject;

    afterEach(async () => {
        await disconnect();
    });

    async function initialize(autoScroll: boolean): Promise<void> {
        ({ element, connect, disconnect } = await setup(autoScroll));
        pageObject = new ChatConversationPageObject(element);
        await connect();
        await pageObject.setViewportHeight(viewportHeight);
    }

    async function fillWithInboundMessages(count: number): Promise<void> {
        for (let i = 0; i < count; i++) {
            // eslint-disable-next-line no-await-in-loop
            await pageObject.appendInboundMessage(
                `Inbound message ${i} with enough text to take up vertical space.`
            );
        }
    }

    describe('with auto-scroll enabled', () => {
        beforeEach(async () => {
            await initialize(true);
        });

        it('keeps all messages in the anchored region when there is no anchor', async () => {
            await fillWithInboundMessages(4);

            expect(pageObject.getHistoryRegionMessageCount()).toBe(0);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(4);
            expect(pageObject.isAnchorRegionReserved()).toBeFalse();
        });

        it('moves messages before the anchor into the history region', async () => {
            await fillWithInboundMessages(3);

            await pageObject.appendOutboundMessage('A user question');

            expect(pageObject.getHistoryRegionMessageCount()).toBe(3);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(1);
            expect(pageObject.isAnchorRegionReserved()).toBeTrue();
        });

        it('keeps the anchor and later messages in the anchored region', async () => {
            await fillWithInboundMessages(2);
            await pageObject.appendOutboundMessage('A user question');
            await pageObject.appendInboundMessage('A streamed response');

            expect(pageObject.getHistoryRegionMessageCount()).toBe(2);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(2);
        });

        it('assigns the history slot only to messages before the anchor', async () => {
            await fillWithInboundMessages(2);
            await pageObject.appendOutboundMessage('A user question');
            await pageObject.appendInboundMessage('A streamed response');

            expect(pageObject.getMessageSlotByIndex(0)).toBe('history');
            expect(pageObject.getMessageSlotByIndex(1)).toBe('history');
            expect(pageObject.getMessageSlotByIndex(2)).toBe('');
            expect(pageObject.getMessageSlotByIndex(3)).toBe('');
        });

        it('preserves author order across the two regions', async () => {
            await pageObject.appendInboundMessage('First');
            await pageObject.appendOutboundMessage('Second');
            await pageObject.appendInboundMessage('Third');

            expect(pageObject.getMessageTextByIndex(0)).toBe('First');
            expect(pageObject.getMessageTextByIndex(1)).toBe('Second');
            expect(pageObject.getMessageTextByIndex(2)).toBe('Third');
        });

        it('repartitions around the most recent anchor', async () => {
            await fillWithInboundMessages(2);
            await pageObject.appendOutboundMessage('First question');
            await pageObject.appendInboundMessage('First response');
            await pageObject.appendOutboundMessage('Second question');

            // History now contains the two inbound, the first outbound and its
            // response; the anchored region holds only the second outbound.
            expect(pageObject.getHistoryRegionMessageCount()).toBe(4);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(1);
            const lastIndex = pageObject.getMessageCount() - 1;
            expect(pageObject.getMessageSlotByIndex(lastIndex)).toBe('');
        });

        it('reserves at least a viewport of space in the anchored region', async () => {
            await fillWithInboundMessages(3);

            await pageObject.appendOutboundMessage('A user question');

            // min-height: 100% reserves the messages viewport (minus padding).
            expect(pageObject.getAnchoredRegionHeight()).toBeGreaterThanOrEqual(
                pageObject.getClientHeight() - 64
            );
        });

        it('does not reserve a viewport when no anchor is present', async () => {
            await pageObject.appendInboundMessage('A short message');

            expect(pageObject.getAnchoredRegionHeight()).toBeLessThan(
                pageObject.getClientHeight()
            );
        });
    });

    describe('with auto-scroll disabled', () => {
        beforeEach(async () => {
            await initialize(false);
        });

        it('keeps every message in the anchored region', async () => {
            await fillWithInboundMessages(3);
            await pageObject.appendOutboundMessage('A user question');

            expect(pageObject.getHistoryRegionMessageCount()).toBe(0);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(4);
            expect(pageObject.isAnchorRegionReserved()).toBeFalse();
        });
    });

    describe('toggling auto-scroll', () => {
        it('returns all messages to a single region when disabled', async () => {
            await initialize(true);
            await fillWithInboundMessages(3);
            await pageObject.appendOutboundMessage('A user question');
            expect(pageObject.getHistoryRegionMessageCount()).toBe(3);

            await pageObject.setAutoScrollEnabled(false);

            expect(pageObject.getHistoryRegionMessageCount()).toBe(0);
            expect(pageObject.getAnchoredRegionMessageCount()).toBe(4);
            expect(pageObject.isAnchorRegionReserved()).toBeFalse();
        });
    });
});
