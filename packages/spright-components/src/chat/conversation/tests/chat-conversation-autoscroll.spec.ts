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

// Characterization tests that pin the current auto-scroll behavior so it can be
// reproduced after the implementation is refactored. Assertions are intentionally
// qualitative (padding applied, pinned to bottom, intent disengages auto-scroll)
// rather than asserting exact pixel offsets, which depend on layout details.
describe('ChatConversation auto-scroll behavior (characterization)', () => {
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

    describe('with auto-scroll disabled', () => {
        beforeEach(async () => {
            await initialize(false);
        });

        it('does not scroll or reserve space when messages are added', async () => {
            await fillWithInboundMessages(8);

            expect(pageObject.getScrollTop()).toBe(0);
            expect(pageObject.isAnchorRegionReserved()).toBeFalse();
        });
    });

    describe('with auto-scroll enabled', () => {
        beforeEach(async () => {
            await initialize(true);
        });

        it('adds messages to the conversation', async () => {
            await fillWithInboundMessages(3);

            expect(pageObject.getMessageCount()).toBe(3);
        });

        it('keeps the conversation pinned to the bottom as inbound messages stream in', async () => {
            await fillWithInboundMessages(8);

            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });

        it('keeps the conversation pinned to the bottom as the last message grows', async () => {
            await fillWithInboundMessages(8);

            await pageObject.appendTextToLastMessage(
                ' Additional streamed content appended to the latest message.'
            );

            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });

        it('reserves space to pin a newly sent outbound message', async () => {
            await fillWithInboundMessages(8);

            await pageObject.appendOutboundMessage('A user question');

            expect(pageObject.isAnchorRegionReserved()).toBeTrue();
        });

        it('keeps following after a programmatic scroll settles short of its target', async () => {
            // Reproduces the first-message regression: a programmatic scroll to
            // the bottom can settle a few pixels short of its requested target
            // (e.g. the achievable max ends up below the target due to layout
            // rounding). The stale target must still be cleared on reaching the
            // bottom, otherwise content-following stays suppressed forever.
            await fillWithInboundMessages(8);
            await pageObject.scrollToBottom();
            pageObject.setProgrammaticScrollTarget(
                pageObject.getScrollTop() + 5
            );

            pageObject.dispatchScroll();

            expect(pageObject.getProgrammaticScrollTarget()).toBeUndefined();

            await pageObject.appendInboundMessage(
                'Streamed response content. '.repeat(10)
            );
            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });

        it('follows streamed content for the first message when the anchor scroll is a no-op', async () => {
            // On the first message the anchored region reserves a full viewport,
            // so the anchor's programmatic scroll targets the current position
            // (max scroll is 0) and emits no scroll event. The programmatic guard
            // must not be left set, or streamed content growth past the viewport
            // would never be followed.
            await pageObject.appendOutboundMessage('A user question');

            expect(pageObject.getProgrammaticScrollTarget()).toBeUndefined();

            await pageObject.appendInboundMessage(
                'Streamed response content that exceeds the viewport. '.repeat(20)
            );
            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });

        it('grows the anchored region and follows the bottom once the response exceeds the viewport', async () => {
            await fillWithInboundMessages(4);
            await pageObject.appendOutboundMessage('A user question');

            // A response taller than the reserved viewport must grow the anchored
            // region's box (not overflow a shrink-clamped region) so streamed
            // content keeps following the bottom.
            const longResponse = 'Streamed response content that keeps growing. '.repeat(60);
            await pageObject.appendInboundMessage(longResponse);

            expect(pageObject.getAnchoredRegionHeight()).toBeGreaterThan(
                pageObject.getClientHeight()
            );
            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });

        it('stops auto-scrolling after the user scrolls up', async () => {
            await fillWithInboundMessages(8);
            expect(pageObject.isScrolledToBottom()).toBeTrue();

            await pageObject.scrollToOffset(0);

            await pageObject.appendTextToLastMessage(
                ' More streamed content that should not pull the view back down.'
            );

            expect(pageObject.isScrolledToBottom()).toBeFalse();
            expect(pageObject.getScrollTop()).toBe(0);
        });

        it('stops auto-scrolling for new messages after the user scrolls up', async () => {
            await fillWithInboundMessages(8);

            await pageObject.scrollToOffset(0);
            await pageObject.appendInboundMessage('A new message while scrolled up');

            expect(pageObject.isScrolledToBottom()).toBeFalse();
            expect(pageObject.getScrollTop()).toBe(0);
        });

        it('resumes auto-scrolling after the user returns to the bottom', async () => {
            await fillWithInboundMessages(8);

            await pageObject.scrollToOffset(0);
            await pageObject.scrollToBottom();

            await pageObject.appendInboundMessage('A message after returning to bottom');

            expect(pageObject.isScrolledToBottom()).toBeTrue();
        });
    });
});
