import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-ai-chat-text-bubble': AIChatTextBubble;
    }
}

/**
 * A Spright demo component (not for production use)
 */
export class AIChatTextBubble extends FoundationElement {}

const sprightAIChatTextBubble = AIChatTextBubble.compose({
    baseName: 'ai-chat-text-bubble',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightAIChatTextBubble());
export const aiChatTextBubbleTag = 'spright-ai-chat-text-bubble';
