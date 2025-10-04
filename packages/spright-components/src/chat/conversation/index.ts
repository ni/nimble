import { FoundationElement } from '@ni/fast-foundation';
import { attr, customElement, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';

export const chatConversationTag = 'spright-chat-conversation';

declare global {
    interface HTMLElementTagNameMap {
        [chatConversationTag]: ChatConversation;
    }
}

/**
 * A Spright component for displaying a series of chat messages
 */
@customElement({
    name: chatConversationTag,
    template,
    styles
})
export class ChatConversation extends FoundationElement {
    @attr
    public appearance = ChatConversationAppearance.default;

    /** @internal */
    @observable
    public inputEmpty = true;

    /** @internal */
    @observable
    public readonly slottedInputElements?: HTMLElement[];

    public slottedInputElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.inputEmpty = !next?.length;
    }
}
