import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-input': ChatInput;
    }
}

/**
 * A Spright component for displaying a series of chat messages
 */
export class ChatInput extends FoundationElement {}

const sprightChatInput = ChatInput.compose({
    baseName: 'chat-input',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatInput());
export const chatInputTag = 'spright-chat-input';
