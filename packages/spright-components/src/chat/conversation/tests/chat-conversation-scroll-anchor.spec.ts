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

// Verifies the conversation captures scroll state on the element itself: the
// outbound scroll anchor, the engagement flag, and the auto-scroll wiring.
describe('ChatConversation scroll anchor state', () => {
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

        it('marks a newly sent outbound message as the scroll anchor', async () => {
            await fillWithInboundMessages(8);

            await pageObject.appendOutboundMessage('A user question');

            const lastIndex = pageObject.getMessageCount() - 1;
            expect(pageObject.isMessageScrollAnchorByIndex(lastIndex)).toBeTrue();
        });

        it('moves the scroll anchor to the most recent outbound message', async () => {
            await fillWithInboundMessages(4);
            await pageObject.appendOutboundMessage('First question');
            const firstOutboundIndex = pageObject.getMessageCount() - 1;

            await fillWithInboundMessages(4);
            await pageObject.appendOutboundMessage('Second question');
            const secondOutboundIndex = pageObject.getMessageCount() - 1;

            expect(
                pageObject.isMessageScrollAnchorByIndex(firstOutboundIndex)
            ).toBeFalse();
            expect(
                pageObject.isMessageScrollAnchorByIndex(secondOutboundIndex)
            ).toBeTrue();
        });

        it('does not mark inbound messages as the scroll anchor', async () => {
            await fillWithInboundMessages(8);

            const lastIndex = pageObject.getMessageCount() - 1;
            expect(pageObject.isMessageScrollAnchorByIndex(lastIndex)).toBeFalse();
        });

        it('anchors a tall outbound message and reserves space', async () => {
            await fillWithInboundMessages(4);

            const longText = 'Question with a great deal of content. '.repeat(20);
            await pageObject.appendOutboundMessage(longText);

            const lastIndex = pageObject.getMessageCount() - 1;
            expect(pageObject.isMessageScrollAnchorByIndex(lastIndex)).toBeTrue();
            expect(pageObject.isAnchorRegionReserved()).toBeTrue();
            expect(pageObject.isAutoScrollEngaged()).toBeTrue();
        });

        it('positions a short outbound message at the top of the viewport', async () => {
            await pageObject.setViewportHeight(300);
            await fillWithInboundMessages(4);
            await pageObject.appendOutboundMessage('A short user question');

            const lastIndex = pageObject.getMessageCount() - 1;
            const scrollTarget = pageObject.getLastProgrammaticScrollTarget();
            const messageTopInContainer = pageObject.getMessageViewportTop(lastIndex) + pageObject.getScrollTop();

            expect(scrollTarget).toBeDefined();
            expect(scrollTarget!).toBeCloseTo(messageTopInContainer, 0);
        });

        it('limits a tall outbound message to at most 20% of the viewport height', async () => {
            await fillWithInboundMessages(4);
            const longText = 'Question with a great deal of content. '.repeat(20);
            await pageObject.appendOutboundMessage(longText);

            const lastIndex = pageObject.getMessageCount() - 1;
            const scrollTarget = pageObject.getProgrammaticScrollTarget();
            expect(scrollTarget).toBeDefined();

            const messageTopInContainer = pageObject.getMessageViewportTop(lastIndex) + pageObject.getScrollTop();
            const messageBottom = messageTopInContainer + pageObject.getMessageHeightByIndex(lastIndex);
            const maxCoverage = pageObject.getClientHeight() * 0.2;
            expect(messageBottom - scrollTarget!).toBeCloseTo(maxCoverage, 0);
        });

        it('disengages auto-scroll when the user scrolls up', async () => {
            await fillWithInboundMessages(8);
            expect(pageObject.isAutoScrollEngaged()).toBeTrue();

            await pageObject.scrollToOffset(0);

            expect(pageObject.isAutoScrollEngaged()).toBeFalse();
        });

        it('re-engages auto-scroll when the user returns to the bottom', async () => {
            await fillWithInboundMessages(8);

            await pageObject.scrollToOffset(0);
            expect(pageObject.isAutoScrollEngaged()).toBeFalse();

            await pageObject.scrollToBottom();

            expect(pageObject.isAutoScrollEngaged()).toBeTrue();
        });
    });

    describe('auto-scroll wiring', () => {
        it('does not connect wiring when auto-scroll is disabled', async () => {
            await initialize(false);

            expect(pageObject.isAutoScrollConnected()).toBeFalse();
        });

        it('connects wiring when auto-scroll is enabled at connect time', async () => {
            await initialize(true);

            expect(pageObject.isAutoScrollConnected()).toBeTrue();
        });

        it('connects wiring when auto-scroll is enabled after connect', async () => {
            await initialize(false);

            await pageObject.setAutoScrollEnabled(true);

            expect(pageObject.isAutoScrollConnected()).toBeTrue();
        });

        it('disconnects wiring and clears reservation when auto-scroll is disabled', async () => {
            await initialize(true);
            await fillWithInboundMessages(4);
            await pageObject.appendOutboundMessage('A user question');
            expect(pageObject.isAnchorRegionReserved()).toBeTrue();

            await pageObject.setAutoScrollEnabled(false);

            expect(pageObject.isAutoScrollConnected()).toBeFalse();
            expect(pageObject.isAnchorRegionReserved()).toBeFalse();
            expect(pageObject.getHistoryRegionMessageCount()).toBe(0);
        });
    });
});
