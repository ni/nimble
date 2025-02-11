import { attr } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageType } from './types';

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
     * The message type of this message in the chat conversation
     * @remarks
     * HTML Attribute: message-type
     */
    @attr({ attribute: 'message-type' })
    public readonly messageType: ChatMessageType = ChatMessageType.system;
}

const sprightChatMessage = ChatMessage.compose({
    baseName: 'chat-message',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessage());
export const chatMessageTag = 'spright-chat-message';
