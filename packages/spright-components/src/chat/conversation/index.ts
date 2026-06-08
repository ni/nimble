import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';
import { ChatConversationScrollManager } from './scroll-manager';

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
    public autoScroll = true;

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
    public messagesContainer: HTMLElement | null = null;
    private scrollManager: ChatConversationScrollManager | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();
        const defaultSlot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null;
        if (this.messagesContainer && defaultSlot) {
            this.scrollManager = new ChatConversationScrollManager(
                this.messagesContainer,
                this,
                defaultSlot,
                () => this.autoScroll
            );
            this.scrollManager.connect();
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.scrollManager?.disconnect();
        this.scrollManager = null;
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
