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

// Maximum fraction of the viewport height that an anchored message may occupy after the
// post-send scroll. Messages taller than this are scrolled past so only this fraction
// remains visible at the top, leaving room for the AI response.
const anchoredMessageMaxViewportFraction = 0.2;

// Slot name for messages that precede the current turn's anchor message.
const historySlotName = 'history';

/**
 * Manages auto-scroll behavior for the chat conversation:
 * - Splits messages into `default` and `history` slots so the top message of the
 *   `default` slot becomes the anchor: it is moved to the top of the viewport and scrolled to on insert
 * - Implements auto scroll when at the bottom of the window as content is added until the user scrolls away
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
     * Whether the anchored region is reserving a viewport of space
     */
    @observable
    public anchorActive = false;

    public get isActive(): boolean {
        return this.resizeObserver !== undefined;
    }

    private scrollAnchorMessage?: ChatMessage;
    private programmaticScrollTarget?: number;
    private resizeObserver?: ResizeObserver;
    private scrollUpdatePending = false;
    private pendingAnchorInsert = false;
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
        this.conversation.anchoredContainer.style.minHeight = '';
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
            } else if (this.autoScrollEngaged && this.programmaticScrollTarget === undefined) {
                this.followContent();
            }
        });
    }

    /**
     * Pins the most recently inserted anchor message near the top of the
     * viewport. Outbound messages taller than anchoredMessageMaxViewportFraction of
     * the viewport are scrolled past so only that fraction remains visible
     */
    private anchorToLastInsertedMessage(): void {
        const message = this.getLastAnchorMessage();
        if (message === undefined) {
            return;
        }

        const anchored = this.conversation.anchoredContainer;
        anchored.style.minHeight = '';

        this.setScrollAnchorMessage(message);
        this.autoScrollEngaged = true;

        const target = this.getAnchorScrollTarget(message);
        const shortfall = target - this.getMaxScrollTop();
        if (shortfall > 0) {
            anchored.style.minHeight = `${anchored.offsetHeight + shortfall}px`;
            void this.conversation.messagesContainer.scrollHeight;
        }
        this.smoothScrollTo(Math.min(target, this.getMaxScrollTop()));
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
            // The programmatic scroll always targets the bottom, so treat it as
            // settled once we reach that target or the bottom itself.
            const reachedTarget = Math.abs(container.scrollTop - this.programmaticScrollTarget) <= 1;
            const reachedBottom = this.getDistanceFromBottom() <= scrollingPixelThreshold;
            if (reachedTarget || reachedBottom) {
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

    private getAnchorScrollTarget(message: ChatMessage): number {
        const container = this.conversation.messagesContainer;
        const containerRect = container.getBoundingClientRect();
        const messageRect = message.getBoundingClientRect();
        const messageTopInContainer = messageRect.top - containerRect.top + container.scrollTop;
        const { clientHeight } = container;
        const maxMessageCoverage = clientHeight * anchoredMessageMaxViewportFraction;
        if (messageRect.height > maxMessageCoverage) {
            return messageTopInContainer + messageRect.height - maxMessageCoverage;
        }
        return messageTopInContainer;
    }

    private smoothScrollTo(scrollTop: number): void {
        const container = this.conversation.messagesContainer;
        if (Math.abs(container.scrollTop - scrollTop) <= 1) {
            // No movement is needed, so `scrollTo` would not emit a scroll event
            // to clear the programmatic guard. Snap to the exact target and
            // leave the guard clear so streamed content keeps being followed.
            this.programmaticScrollTarget = undefined;
            container.scrollTop = scrollTop;
            return;
        }
        this.programmaticScrollTarget = scrollTop;
        container.scrollTo({
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
