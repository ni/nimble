import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { AIChatActor } from '../ai-chat/types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-ai-chat-text-bubble': AIChatTextBubble;
    }
}

/**
 * A Spright component for displaying AI chat text in a bubble
 */
export class AIChatTextBubble extends FoundationElement {
    /**
     * @public
     * The actor responsible for this conversation contribution
     * @remarks
     * HTML Attribute: actor
     */
    @attr
    public readonly actor: AIChatActor = AIChatActor.user;

    /**
     *
     * @public
     * Text to render within the bubble.
     */
    @observable
    public text = '';
}

const sprightAIChatTextBubble = AIChatTextBubble.compose({
    baseName: 'ai-chat-text-bubble',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightAIChatTextBubble());
export const aiChatTextBubbleTag = 'spright-ai-chat-text-bubble';
