import { html } from '@ni/fast-element';
import { parameterizeSuite } from '@ni/jasmine-parameterized';
import { ChatMessageInbound, chatMessageInboundTag } from '../inbound';
import { ChatMessageOutbound, chatMessageOutboundTag } from '../outbound';
import { ChatMessageSystem, chatMessageSystemTag } from '../system';
import { fixture } from '../../../utilities/tests/fixture';
import { ChatMessagePageObject } from '../testing/chat-message.pageobject';

type MessageElement = ChatMessageInbound | ChatMessageOutbound | ChatMessageSystem;

const messageVariants = [
    {
        name: 'inbound',
        tag: chatMessageInboundTag,
        anchorOnInsert: false,
        construct: () => html<unknown>`<${chatMessageInboundTag}>Message content</${chatMessageInboundTag}>`
    },
    {
        name: 'outbound',
        tag: chatMessageOutboundTag,
        anchorOnInsert: true,
        construct: () => html<unknown>`<${chatMessageOutboundTag}>Message content</${chatMessageOutboundTag}>`
    },
    {
        name: 'system',
        tag: chatMessageSystemTag,
        anchorOnInsert: false,
        construct: () => html<unknown>`<${chatMessageSystemTag}>Message content</${chatMessageSystemTag}>`
    }
] as const;

describe('ChatMessage internals', () => {
    parameterizeSuite(messageVariants, (suite, name, value) => {
        suite(name, () => {
            let element: MessageElement;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;
            let pageObject: ChatMessagePageObject;

            beforeEach(async () => {
                ({ element, connect, disconnect } = await fixture<MessageElement>(
                    value.construct()
                ));
                pageObject = new ChatMessagePageObject(element);
                await connect();
            });

            afterEach(async () => {
                await disconnect();
            });

            it('exposes messageInternals', () => {
                expect(element.messageInternals).toBeDefined();
            });

            it('declares anchorOnInsert for its message type', () => {
                expect(element.messageInternals.anchorOnInsert).toBe(
                    value.anchorOnInsert
                );
            });

            it('defaults isScrollAnchor to false', () => {
                expect(pageObject.isScrollAnchor()).toBeFalse();
            });

            it('reflects isScrollAnchor when set by the conversation', () => {
                element.messageInternals.isScrollAnchor = true;
                expect(pageObject.isScrollAnchor()).toBeTrue();
            });

            it('renders slotted text content', () => {
                expect(pageObject.getRenderedText()).toBe('Message content');
            });
        });
    });
});
