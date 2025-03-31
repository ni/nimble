import { attr } from '@ni/fast-element';
import {
    applyMixins,
    DesignSystem,
    FoundationElement,
    StartEnd,
    type FoundationElementDefinition,
    type StartEndOptions
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageType } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message': ChatMessage;
    }
}

/**
 * SprightChatMessage configuration options
 * @public
 */
export type ChatMessageOptions = FoundationElementDefinition & StartEndOptions;

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
applyMixins(ChatMessage, StartEnd);

const sprightChatMessage = ChatMessage.compose({
    baseName: 'chat-message',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessage());
export const chatMessageTag = 'spright-chat-message';
