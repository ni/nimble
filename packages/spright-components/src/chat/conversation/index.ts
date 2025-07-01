import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-conversation': ChatConversation;
    }
}

/**
 * A Spright component for displaying a series of chat messages
 */
export class ChatConversation extends FoundationElement {
    /** @internal */
    @observable
    public inputIsEmpty = true;

    /** @internal */
    @observable
    public readonly slottedInputElements?: HTMLElement[];

    public slottedInputElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.inputIsEmpty = !next?.length;
    }
}

const sprightChatConversation = ChatConversation.compose({
    baseName: 'chat-conversation',
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('spright')
    .register(sprightChatConversation());
export const chatConversationTag = 'spright-chat-conversation';
