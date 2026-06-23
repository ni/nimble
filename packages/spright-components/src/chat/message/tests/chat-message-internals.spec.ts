import { html } from '@ni/fast-element';
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
        construct: () => html<unknown>`<${chatMessageInboundTag}>Message content</${chatMessageInboundTag}>`
    },
    {
        name: 'outbound',
        tag: chatMessageOutboundTag,
        construct: () => html<unknown>`<${chatMessageOutboundTag}>Message content</${chatMessageOutboundTag}>`
    },
    {
        name: 'system',
        tag: chatMessageSystemTag,
        construct: () => html<unknown>`<${chatMessageSystemTag}>Message content</${chatMessageSystemTag}>`
    }
] as const;

describe('ChatMessage internals', () => {
    for (const variant of messageVariants) {
        describe(variant.name, () => {
            let element: MessageElement;
            let connect: () => Promise<void>;
            let disconnect: () => Promise<void>;
            let pageObject: ChatMessagePageObject;

            beforeEach(async () => {
                ({ element, connect, disconnect } = await fixture<MessageElement>(
                    variant.construct()
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
    }
});
