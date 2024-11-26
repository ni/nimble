import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageStatus } from '../chat/types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message': ChatMessage;
    }
}

/**
 * A Spright component for displaying a chat message
 */
export class ChatMessage extends FoundationElement {
    /**
     * @public
     * The status of this message in the chat conversation
     * @remarks
     * HTML Attribute: status
     */
    @attr
    public readonly status: ChatMessageStatus = ChatMessageStatus.outgoing;
}

const sprightChatMessage = ChatMessage.compose({
    baseName: 'chat-message',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessage());
export const chatMessageTag = 'spright-chat-message';
