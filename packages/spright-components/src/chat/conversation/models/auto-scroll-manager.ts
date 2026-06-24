import {
    type Notifier,
    Observable,
    observable,
    type Subscriber
} from '@ni/fast-element';
import type { ChatConversation } from '..';
import {
    ChatMessageInternals,
    type ChatMessage
} from '../../message/models/chat-message-internals';

// Distance from the bottom (px) within which the conversation is considered "at the bottom".
const scrollingPixelThreshold = 10;

// Slot name for messages that precede the current turn's anchor message.
const historySlotName = 'history';

/**
 * Manages auto-scroll behavior for the chat conversation: partitioning messages
 * into a history region and an anchored region, pinning a newly inserted anchor
 * message near the top of the viewport (via a `min-height: 100%` reservation on
 * the anchored region, which requires the conversation to have a definite
 * height), following streamed content, and disengaging when the user scrolls
 * away. The conversation owns a single instance for its lifetime and calls
 * `connect()`/`disconnect()` to register and tear down observers whenever the
 * element is connected and `autoScroll` is enabled.
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
     * Whether the anchored region is reserving a viewport of space (via its
     * `min-height: 100%`) to hold the current turn's anchor message near the top.
     * Bound to the `anchor-active` class on the anchored region in the template.
     */
    @observable
    public anchorActive = false;

    public get isActive(): boolean {
        return this.resizeObserver !== undefined;
    }

    // The message the conversation currently anchors to.
    private scrollAnchorMessage?: ChatMessage;
    // Target of an in-progress smooth programmatic scroll; suppresses scroll-intent handling until reached.
    private programmaticScrollTarget?: number;
    private resizeObserver?: ResizeObserver;
    private scrollUpdatePending = false;
    private pendingAnchorInsert = false;
    // Snapshot of messages used to detect additions across change notifications.
    private previousMessages: ChatMessage[] = [];
    private readonly conversationNotifier: Notifier;

    public constructor(private readonly conversation: ChatConversation) {
        this.conversationNotifier = Observable.getNotifier(this.conversation);
    }

    public connect(): void {
        this.autoScrollEngaged = true;
        this.previousMessages = this.getOrderedMessages();
        this.conversationNotifier.subscribe(this, 'slottedMessages');
        this.conversationNotifier.subscribe(this, 'slottedHistoryMessages');
        this.conversation.messagesContainer.addEventListener(
            'scroll',
            this.onScroll,
            { passive: true }
        );
        this.resizeObserver = new ResizeObserver(() => {
            this.onContentSizeChanged();
        });
        // Observe the anchored region for streamed content growth and the scroll
        // viewport so the conversation stays pinned when its height changes.
        this.resizeObserver.observe(this.conversation.anchoredContainer);
        this.resizeObserver.observe(this.conversation.messagesContainer);
        this.repartition(this.previousMessages);
    }

    public disconnect(): void {
        this.conversationNotifier.unsubscribe(this, 'slottedMessages');
        this.conversationNotifier.unsubscribe(this, 'slottedHistoryMessages');
        this.conversation.messagesContainer.removeEventListener(
            'scroll',
            this.onScroll
        );
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.setScrollAnchorMessage(undefined);
        this.clearSlotAssignments();
        this.anchorActive = false;
        this.previousMessages = [];
    }

    public handleChange(source: unknown, args: unknown): void {
        if (
            source === this.conversation
            && (args === 'slottedMessages' || args === 'slottedHistoryMessages')
        ) {
            this.onMessagesChanged();
        }
    }

    private onMessagesChanged(): void {
        const current = this.getOrderedMessages();
        const previousSet = new Set(this.previousMessages);
        const addedMessages = current.filter(
            message => !previousSet.has(message)
        );
        this.previousMessages = current;
        this.repartition(current);
        if (addedMessages.length === 0) {
            return;
        }
        const hasAnchorMessage = addedMessages.some(
            message => message.messageInternals.anchorOnInsert
        );
        this.scheduleScrollUpdate(hasAnchorMessage);
    }

    private repartition(messages: ChatMessage[]): void {
        const anchorIndex = this.findLatestAnchorIndex(messages);
        messages.forEach((message, index) => {
            message.messageInternals.slot = anchorIndex >= 0 && index < anchorIndex
                ? historySlotName
                : undefined;
        });
        this.anchorActive = anchorIndex >= 0;
    }

    private clearSlotAssignments(): void {
        for (const message of this.getOrderedMessages()) {
            message.messageInternals.slot = undefined;
        }
    }

    private scheduleScrollUpdate(hasAnchorMessage: boolean): void {
        this.pendingAnchorInsert = this.pendingAnchorInsert || hasAnchorMessage;
        if (this.scrollUpdatePending) {
            return;
        }
        this.scrollUpdatePending = true;
        requestAnimationFrame(() => {
            this.scrollUpdatePending = false;
            const anchorInsert = this.pendingAnchorInsert;
            this.pendingAnchorInsert = false;
            if (anchorInsert) {
                this.anchorToLastInsertedMessage();
            } else if (this.autoScrollEngaged) {
                this.followContent();
            }
        });
    }

    /**
     * Pins the most recently inserted anchor message near the top of the
     * viewport. The anchored region reserves a viewport via `min-height: 100%`,
     * so scrolling to the bottom places the anchor at the top with reserved
     * space below it for the response to fill.
     */
    private anchorToLastInsertedMessage(): void {
        const message = this.getLastAnchorMessage();
        if (message === undefined) {
            return;
        }
        this.setScrollAnchorMessage(message);
        this.autoScrollEngaged = true;
        this.smoothScrollTo(this.getMaxScrollTop());
    }

    private followContent(): void {
        this.instantScrollTo(this.getMaxScrollTop());
    }

    private onContentSizeChanged(): void {
        // Reacts to streamed content growth and viewport height changes.
        // While a pending or in-progress anchor insert owns positioning, let its
        // smooth scroll settle instead of competing with an instant follow.
        if (
            this.pendingAnchorInsert
            || this.programmaticScrollTarget !== undefined
        ) {
            return;
        }
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
        return scrollHeight - scrollTop - clientHeight;
    }

    private getMaxScrollTop(): number {
        const { scrollHeight, clientHeight } = this.conversation.messagesContainer;
        return Math.max(0, scrollHeight - clientHeight);
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

    private setScrollAnchorMessage(message?: ChatMessage): void {
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

    private getLastAnchorMessage(): ChatMessage | undefined {
        const messages = this.getOrderedMessages();
        const index = this.findLatestAnchorIndex(messages);
        return index >= 0 ? messages[index] : undefined;
    }

    private findLatestAnchorIndex(messages: ChatMessage[]): number {
        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            if (message?.messageInternals.anchorOnInsert) {
                return i;
            }
        }
        return -1;
    }

    private getOrderedMessages(): ChatMessage[] {
        const messages: ChatMessage[] = [];
        for (const child of Array.from(this.conversation.children)) {
            if (ChatMessageInternals.elementHasMessageInternals(child)) {
                messages.push(child);
            }
        }
        return messages;
    }
}
