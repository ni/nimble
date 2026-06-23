import {
    DesignSystem,
    FoundationElement,
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatMessageInternals } from '../models/chat-message-internals';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-message-system': ChatMessageSystem;
    }
}

/**
 * A Spright component for displaying an system chat message
 */
export class ChatMessageSystem extends FoundationElement {
    /** @internal */
    public readonly messageInternals = new ChatMessageInternals();
}

const sprightChatMessageSystem = ChatMessageSystem.compose({
    baseName: 'chat-message-system',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessageSystem());
export const chatMessageSystemTag = 'spright-chat-message-system';
