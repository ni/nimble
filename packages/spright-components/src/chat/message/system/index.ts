import {
    DesignSystem,
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageBase } from '../base';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message-system': ChatMessageSystem;
    }
}

/**
 * A Spright component for displaying an system chat message
 */
export class ChatMessageSystem extends ChatMessageBase {
}

const sprightChatMessageSystem = ChatMessageSystem.compose({
    baseName: 'chat-message-system',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageSystem());
export const chatMessageSystemTag = 'spright-chat-message-system';
