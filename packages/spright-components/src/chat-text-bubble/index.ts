import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatActor } from '../chat/types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-text-bubble': ChatTextBubble;
    }
}

/**
 * A Spright component for displaying chat text in a bubble
 */
export class ChatTextBubble extends FoundationElement {
    /**
     * @public
     * The actor responsible for this conversation contribution
     * @remarks
     * HTML Attribute: actor
     */
    @attr
    public readonly actor: ChatActor = ChatActor.user;

    /**
     *
     * @public
     * Text to render within the bubble.
     */
    @observable
    public text = '';
}

const sprightChatTextBubble = ChatTextBubble.compose({
    baseName: 'chat-text-bubble',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatTextBubble());
export const chatTextBubbleTag = 'spright-chat-text-bubble';
