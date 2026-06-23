import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable, DOM } from '@ni/fast-element';
import { mediumPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { styles } from './styles';
import { template } from './template';
import { ChatConversationAppearance } from './types';
import {
    type ChatMessageOutbound,
    chatMessageOutboundTag
} from '../message/outbound';

declare global {
    interface HTMLElementTagNameMap {
        'spright-chat-conversation': ChatConversation;
    }
}

// Distance from the bottom (px) within which the conversation is considered "at the bottom".
const scrollingPixelThreshold = 10;

/**
 * A Spright component for displaying a series of chat messages
 */
export class ChatConversation extends FoundationElement {
    @attr
    public appearance = ChatConversationAppearance.default;

    @attr({ attribute: 'auto-scroll', mode: 'boolean' })
    public autoScroll = false;

    /**
     * Whether auto-scroll is currently following new content. Set to false when
     * the user scrolls away from the bottom and back to true when they return.
     * @internal
     */
    @observable
    public autoScrollEngaged = true;

    /**
     * Height (px) of the spacer rendered below the messages. Used to hold a newly
     * sent outbound message near the top of the viewport while the response grows
     * below it. Bound to the spacer element in the template.
     * @internal
     */
    @observable
    public bottomSpacerHeight = 0;

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

    // True while auto-scroll wiring (listeners/observer) is attached.
    private scrollWiringActive = false;
    // The most recently sent outbound message that the conversation anchors to.
    private scrollAnchorMessage?: ChatMessageOutbound;
    // The scrollTop at which the anchored message sits at the top of the viewport.
    private anchorScrollTop = 0;
    // Target of an in-progress smooth programmatic scroll; suppresses scroll-intent handling until reached.
    private programmaticScrollTarget?: number;
    private resizeObserver?: ResizeObserver;
    private scrollUpdatePending = false;
    private pendingAnchorOutbound = false;

    public override connectedCallback(): void {
        super.connectedCallback();
        if (this.autoScroll) {
            this.enableAutoScroll();
        }
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.disableAutoScroll();
    }

    public autoScrollChanged(_prev: boolean, next: boolean): void {
        if (next && this.isConnected) {
            this.enableAutoScroll();
        } else {
            this.disableAutoScroll();
        }
    }

    public slottedMessagesChanged(
        prev: HTMLElement[] | undefined,
        next: HTMLElement[] | undefined
    ): void {
        if (!this.scrollWiringActive) {
            return;
        }
        const previousSet = new Set(prev ?? []);
        const addedMessages = (next ?? []).filter(
            message => !previousSet.has(message)
        );
        if (addedMessages.length === 0) {
            return;
        }
        const hasOutbound = addedMessages.some(message => this.isOutboundMessage(message));
        this.scheduleScrollUpdate(hasOutbound);
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

    private enableAutoScroll(): void {
        if (this.scrollWiringActive || this.messagesContainer === undefined) {
            return;
        }
        this.scrollWiringActive = true;
        this.autoScrollEngaged = true;
        this.messagesContainer.addEventListener('scroll', this.onScroll, {
            passive: true
        });
        this.resizeObserver = new ResizeObserver(() => {
            this.onContentSizeChanged();
        });
        this.resizeObserver.observe(this.messagesContent);
    }

    private disableAutoScroll(): void {
        if (!this.scrollWiringActive) {
            return;
        }
        this.scrollWiringActive = false;
        this.messagesContainer.removeEventListener('scroll', this.onScroll);
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.setScrollAnchorMessage(undefined);
        this.anchorScrollTop = 0;
        this.setBottomSpacerHeight(0);
    }

    private scheduleScrollUpdate(hasOutbound: boolean): void {
        this.pendingAnchorOutbound = this.pendingAnchorOutbound || hasOutbound;
        if (this.scrollUpdatePending) {
            return;
        }
        this.scrollUpdatePending = true;
        requestAnimationFrame(() => {
            this.scrollUpdatePending = false;
            const anchorOutbound = this.pendingAnchorOutbound;
            this.pendingAnchorOutbound = false;
            if (anchorOutbound) {
                this.anchorToLastOutboundMessage();
            } else if (this.autoScrollEngaged) {
                this.followContent();
            }
        });
    }

    /**
     * Positions the last outbound message at the top of the visible viewport,
     * using the bottom spacer to prevent the content from being pushed up as the
     * response grows below.
     */
    private anchorToLastOutboundMessage(): void {
        const message = this.getLastOutboundMessage();
        if (message === undefined) {
            return;
        }
        this.setScrollAnchorMessage(message);
        this.autoScrollEngaged = true;

        const geometry = this.getMessageGeometry(message);
        const { clientHeight } = this.messagesContainer;
        if (geometry.height >= clientHeight / 2) {
            this.anchorTallMessage(geometry.top, geometry.height);
        } else if (geometry.top <= 0) {
            this.resetSpacerForTopAlignedMessage();
        } else {
            this.anchorMessageWithSpacer(geometry.top, geometry.height);
        }
    }

    private anchorTallMessage(messageTop: number, messageHeight: number): void {
        const { clientHeight } = this.messagesContainer;
        const lineGap = Math.round(clientHeight * 0.2);
        const scrollTarget = Math.max(0, messageTop + messageHeight - lineGap);
        const spacer = clientHeight - lineGap;

        this.anchorScrollTop = scrollTarget;
        this.setBottomSpacerHeight(spacer);
        this.smoothScrollTo(scrollTarget);
    }

    private resetSpacerForTopAlignedMessage(): void {
        if (this.bottomSpacerHeight > 0) {
            this.setBottomSpacerHeight(0);
            this.anchorScrollTop = 0;
        }
    }

    private anchorMessageWithSpacer(
        messageTop: number,
        messageHeight: number
    ): void {
        const topMargin = parseFloat(mediumPadding.getValueFor(this));
        const scrollTarget = Math.max(0, messageTop - topMargin);
        if (scrollTarget === 0) {
            this.resetSpacerForTopAlignedMessage();
            return;
        }

        const { clientHeight, scrollTop } = this.messagesContainer;
        const contentWithoutSpacer = messageTop + messageHeight;
        const neededSpacer = Math.max(
            0,
            scrollTarget + clientHeight - contentWithoutSpacer
        );
        const preventClampSpacer = Math.max(
            0,
            scrollTop + clientHeight - contentWithoutSpacer
        );
        const spacer = Math.max(neededSpacer, preventClampSpacer);

        this.anchorScrollTop = scrollTarget;
        this.setBottomSpacerHeight(spacer);
        this.smoothScrollTo(scrollTarget);
    }

    /**
     * Shrinks the bottom spacer as content grows to fill the space below the
     * anchored message. Once the spacer reaches zero, follows the bottom normally.
     */
    private followContent(): void {
        if (this.anchorScrollTop > 0 && this.bottomSpacerHeight > 0) {
            const contentHeight = this.messagesContainer.scrollHeight - this.bottomSpacerHeight;
            const neededSpacer = Math.max(
                0,
                this.anchorScrollTop + this.messagesContainer.clientHeight - contentHeight
            );
            this.setBottomSpacerHeight(neededSpacer);
        }
        if (this.bottomSpacerHeight === 0) {
            this.instantScrollTo(this.messagesContainer.scrollHeight);
        }
    }

    private onContentSizeChanged(): void {
        if (this.autoScrollEngaged) {
            this.followContent();
        }
    }

    private readonly onScroll = (): void => {
        if (this.programmaticScrollTarget !== undefined) {
            if (Math.abs(this.messagesContainer.scrollTop - this.programmaticScrollTarget) <= 1) {
                this.programmaticScrollTarget = undefined;
            }
            return;
        }
        this.autoScrollEngaged = this.getDistanceFromBottom() <= scrollingPixelThreshold;
    };

    private getDistanceFromBottom(): number {
        const { scrollTop, scrollHeight, clientHeight } = this.messagesContainer;
        return scrollHeight - this.bottomSpacerHeight - scrollTop - clientHeight;
    }

    private setBottomSpacerHeight(height: number): void {
        if (this.bottomSpacerHeight !== height) {
            this.bottomSpacerHeight = height;
            // Flush so the spacer's layout is applied before measuring or scrolling.
            DOM.processUpdates();
        }
    }

    private smoothScrollTo(scrollTop: number): void {
        this.programmaticScrollTarget = scrollTop;
        this.messagesContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
    }

    private instantScrollTo(scrollTop: number): void {
        this.messagesContainer.scrollTop = scrollTop;
    }

    private setScrollAnchorMessage(message?: ChatMessageOutbound): void {
        if (this.scrollAnchorMessage === message) {
            return;
        }
        if (this.scrollAnchorMessage !== undefined) {
            this.scrollAnchorMessage.messageInternals.isScrollAnchor = false;
        }
        this.scrollAnchorMessage = message;
        if (message !== undefined) {
            message.messageInternals.isScrollAnchor = true;
        }
    }

    private getLastOutboundMessage(): ChatMessageOutbound | undefined {
        const messages = this.slottedMessages ?? [];
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message !== undefined && this.isOutboundMessage(message)) {
                return message as ChatMessageOutbound;
            }
        }
        return undefined;
    }

    private getMessageGeometry(message: HTMLElement): {
        top: number,
        height: number
    } {
        const containerRect = this.messagesContainer.getBoundingClientRect();
        const messageRect = message.getBoundingClientRect();
        const top = this.messagesContainer.scrollTop + (messageRect.top - containerRect.top);
        return { top, height: messageRect.height };
    }

    private isOutboundMessage(element: Element): boolean {
        return element.tagName.toLowerCase() === chatMessageOutboundTag;
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
