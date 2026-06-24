import {
    DOM,
    type Notifier,
    Observable,
    observable,
    type Subscriber
} from '@ni/fast-element';
import { mediumPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import type { ChatConversation } from '..';
import {
    type ChatMessageOutbound,
    chatMessageOutboundTag
} from '../../message/outbound';

// Distance from the bottom (px) within which the conversation is considered "at the bottom".
const scrollingPixelThreshold = 10;

/**
 * Manages auto-scroll behavior for the chat conversation: pinning a newly sent
 * outbound message near the top of the viewport, following streamed content, and
 * disengaging when the user scrolls away. The conversation owns a single instance
 * for its lifetime and calls `connect()`/`disconnect()` to register and tear down
 * the observers whenever the element is connected and `autoScroll` is enabled.
 * @internal
 */
export class AutoScrollManager implements Subscriber {
    /**
     * Whether auto-scroll is currently following new content. Set to false when
     * the user scrolls away from the bottom and back to true when they return.
     */
    @observable
    public autoScrollEngaged = true;

    /**
     * Height (px) of the spacer rendered below the messages. Used to hold a newly
     * sent outbound message near the top of the viewport while the response grows
     * below it. Bound to the spacer element in the template.
     */
    @observable
    public bottomSpacerHeight = 0;

    public get isActive(): boolean {
        return this.resizeObserver !== undefined;
    }

    // The most recently sent outbound message that the conversation anchors to.
    private scrollAnchorMessage?: ChatMessageOutbound;
    // The scrollTop at which the anchored message sits at the top of the viewport.
    private anchorScrollTop = 0;
    // Target of an in-progress smooth programmatic scroll; suppresses scroll-intent handling until reached.
    private programmaticScrollTarget?: number;
    private resizeObserver?: ResizeObserver;
    private scrollUpdatePending = false;
    private pendingAnchorOutbound = false;
    // Snapshot of slotted messages used to detect additions across change notifications.
    private previousMessages: HTMLElement[] = [];
    private readonly conversationNotifier: Notifier;

    public constructor(private readonly conversation: ChatConversation) {
        this.conversationNotifier = Observable.getNotifier(this.conversation);
    }

    public connect(): void {
        this.autoScrollEngaged = true;
        this.snapshotMessages();
        this.conversationNotifier.subscribe(this, 'slottedMessages');
        this.conversation.messagesContainer.addEventListener(
            'scroll',
            this.onScroll,
            { passive: true }
        );
        this.resizeObserver = new ResizeObserver(() => {
            this.onContentSizeChanged();
        });
        this.resizeObserver.observe(this.conversation.messagesContent);
    }

    public disconnect(): void {
        this.conversationNotifier.unsubscribe(this, 'slottedMessages');
        this.conversation.messagesContainer.removeEventListener(
            'scroll',
            this.onScroll
        );
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.setScrollAnchorMessage(undefined);
        this.anchorScrollTop = 0;
        this.setBottomSpacerHeight(0);
        this.previousMessages = [];
    }

    public handleChange(source: unknown, args: unknown): void {
        if (source === this.conversation && args === 'slottedMessages') {
            this.onMessagesChanged();
        }
    }

    private onMessagesChanged(): void {
        const current = this.conversation.slottedMessages ?? [];
        const previousSet = new Set(this.previousMessages);
        const addedMessages = current.filter(
            message => !previousSet.has(message)
        );
        this.previousMessages = [...current];
        if (addedMessages.length === 0) {
            return;
        }
        const hasOutbound = addedMessages.some(message => this.isOutboundMessage(message));
        this.scheduleScrollUpdate(hasOutbound);
    }

    private snapshotMessages(): void {
        this.previousMessages = [...(this.conversation.slottedMessages ?? [])];
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
        const { clientHeight } = this.conversation.messagesContainer;
        if (geometry.height >= clientHeight / 2) {
            this.anchorTallMessage(geometry.top, geometry.height);
        } else if (geometry.top <= 0) {
            this.resetSpacerForTopAlignedMessage();
        } else {
            this.anchorMessageWithSpacer(geometry.top, geometry.height);
        }
    }

    private anchorTallMessage(messageTop: number, messageHeight: number): void {
        const { clientHeight } = this.conversation.messagesContainer;
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
        const topMargin = parseFloat(
            mediumPadding.getValueFor(this.conversation)
        );
        const scrollTarget = Math.max(0, messageTop - topMargin);
        if (scrollTarget === 0) {
            this.resetSpacerForTopAlignedMessage();
            return;
        }

        const { clientHeight, scrollTop } = this.conversation.messagesContainer;
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
        const container = this.conversation.messagesContainer;
        if (this.anchorScrollTop > 0 && this.bottomSpacerHeight > 0) {
            const contentHeight = container.scrollHeight - this.bottomSpacerHeight;
            const neededSpacer = Math.max(
                0,
                this.anchorScrollTop + container.clientHeight - contentHeight
            );
            this.setBottomSpacerHeight(neededSpacer);
        }
        if (this.bottomSpacerHeight === 0) {
            this.instantScrollTo(container.scrollHeight);
        }
    }

    private onContentSizeChanged(): void {
        if (this.autoScrollEngaged) {
            this.followContent();
        }
    }

    private readonly onScroll = (): void => {
        const container = this.conversation.messagesContainer;
        if (this.programmaticScrollTarget !== undefined) {
            if (
                Math.abs(container.scrollTop - this.programmaticScrollTarget) <= 1
            ) {
                this.programmaticScrollTarget = undefined;
            }
            return;
        }
        this.autoScrollEngaged = this.getDistanceFromBottom() <= scrollingPixelThreshold;
    };

    private getDistanceFromBottom(): number {
        const { scrollTop, scrollHeight, clientHeight } = this.conversation.messagesContainer;
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
        this.conversation.messagesContainer.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    private instantScrollTo(scrollTop: number): void {
        this.conversation.messagesContainer.scrollTop = scrollTop;
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
        const messages = this.conversation.slottedMessages ?? [];
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
        const container = this.conversation.messagesContainer;
        const containerRect = container.getBoundingClientRect();
        const messageRect = message.getBoundingClientRect();
        const top = container.scrollTop + (messageRect.top - containerRect.top);
        return { top, height: messageRect.height };
    }

    private isOutboundMessage(element: Element): boolean {
        return element.tagName.toLowerCase() === chatMessageOutboundTag;
    }
}
