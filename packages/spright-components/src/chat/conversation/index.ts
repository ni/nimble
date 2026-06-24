import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';
import { AutoScrollManager } from './models/auto-scroll-manager';

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

    @attr({ attribute: 'auto-scroll', mode: 'boolean' })
    public autoScroll = false;

    /**
     * Manages auto-scroll behavior. Always present; its observers are registered
     * while the conversation is connected and `autoScroll` is enabled.
     * @internal
     */
    public readonly autoScrollManager = new AutoScrollManager(this);

    /** @internal */
    @observable
    public readonly slottedMessages?: HTMLElement[];

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

    /** @internal */
    @observable
    public startEmpty = true;

    /** @internal */
    @observable
    public readonly slottedStartElements?: HTMLElement[];

    /** @internal */
    @observable
    public endEmpty = true;

    /** @internal */
    @observable
    public readonly slottedEndElements?: HTMLElement[];

    /** @internal */
    public messagesContainer!: HTMLElement;

    /** @internal */
    public messagesContent!: HTMLElement;

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.autoScroll) {
            this.autoScrollManager.connect();
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.autoScroll) {
            this.autoScrollManager.disconnect();
        }
    }

    public autoScrollChanged(): void {
        if (this.$fastController.isConnected) {
            if (this.autoScroll) {
                this.autoScrollManager.connect();
            } else {
                this.autoScrollManager.disconnect();
            }
        }
    }

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

    public slottedStartElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.startEmpty = next === undefined || next.length === 0;
    }

    public slottedEndElementsChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        this.endEmpty = next === undefined || next.length === 0;
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
