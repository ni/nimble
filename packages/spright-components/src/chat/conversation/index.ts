import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';
import { ChatConversationScrollManager } from './utils/scroll-manager';
import { ChatConversationScrollApi } from './utils/scroll-api';

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

    /** @internal */
    public defaultSlot!: HTMLSlotElement;

    private scrollManager: ChatConversationScrollManager | null = null;
    private scrollApi: ChatConversationScrollApi | null = null;

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.autoScroll) {
            this.connectScrollManager();
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disconnectScrollManager();
    }

    public autoScrollChanged(_prev: boolean, next: boolean): void {
        if (next && this.isConnected) {
            this.connectScrollManager();
        } else {
            this.disconnectScrollManager();
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

    private connectScrollManager(): void {
        if (this.messagesContainer !== null) {
            this.scrollApi = new ChatConversationScrollApi(
                this.messagesContainer,
                this,
                this.defaultSlot
            );
            this.scrollManager = new ChatConversationScrollManager(
                this.scrollApi,
                this
            );
            this.scrollManager.connect();
        }
    }

    private disconnectScrollManager(): void {
        this.scrollManager?.disconnect();
        this.scrollManager = null;
        this.scrollApi = null;
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
