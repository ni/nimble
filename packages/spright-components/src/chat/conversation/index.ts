import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-conversation': ChatConversation;
    }
}

/**
 * A Spright component for displaying a series of chat messages
 */
export class ChatConversation extends FoundationElement {
    @attr
    public appearance = ChatConversationAppearance.default;

    /** @internal */
    @observable
    public inputEmpty = true;

    /** @internal */
    @observable
    public readonly slottedInputElements?: HTMLElement[];

    /** @internal */
    @observable
    public toolbarEmpty = true;

    /** @internal */
    @observable
    public readonly slottedToolbarElements?: HTMLElement[];

    public slottedInputElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.inputEmpty = next === undefined || next.length === 0;
    }

    public slottedToolbarElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.toolbarEmpty = next === undefined || next.length === 0;
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
