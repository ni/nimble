import {
    DesignSystem,
    FoundationElement,
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message-outbound': ChatMessageOutbound;
    }
}

/**
 * A Spright component for displaying an outbound chat message
 */
export class ChatMessageOutbound extends FoundationElement {
}

const sprightChatMessageOutbound = ChatMessageOutbound.compose({
    baseName: 'chat-message-outbound',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageOutbound());
export const chatMessageOutboundTag = 'spright-chat-message-outbound';
