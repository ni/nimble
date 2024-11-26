import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { ChatActor } from '../chat/types';

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

const sprightChatMessage = ChatMessage.compose({
    baseName: 'chat-message',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('spright').register(sprightChatMessage());
export const chatMessageTag = 'spright-chat-message';
