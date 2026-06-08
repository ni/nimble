import { mediumPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';

/**
 * Encapsulates all scroll management logic for the ChatConversation component.
 */
export class ChatConversationScrollManager {
    // Distance from the bottom (px) within which the user is considered "at the bottom".
    private readonly scrollingPixelThreshold = 10;
    // True when the user has manually scrolled up; suppresses auto-scroll until they return to the bottom.
    private isUserScrolledUp = false;
    // Deduplicates multiple mutation callbacks within the same animation frame.
    private scrollPending = false;
    // Set when a new outbound message is detected; causes the next rAF to scroll to that message's top.
    private scrollToUserMessagePending = false;
    // Current bottom padding (px) applied to the scroll container to hold the user message in place.
    private bottomPaddingPx = 0;
    // The scrollTop at which the last user message sits at the top of the viewport.
    private userMessageScrollTop = 0;
    // ScrollTop recorded after the last scroll event, used to detect scroll direction.
    private previousScrollTop = 0;
    // True while a programmatic smooth scroll is in progress; prevents treating it as a user scroll.
    private programmaticScrolling = false;
    private resizeObserver: ResizeObserver | null = null;
    private mutationObserver: MutationObserver | null = null;
    private slotChangeHandler: (() => void) | null = null;

    public constructor(
        private readonly container: HTMLElement,
        private readonly hostElement: HTMLElement,
        private readonly defaultSlot: HTMLSlotElement,
        private readonly getAutoScroll: () => boolean
    ) {}

    public connect(): void {
        this.previousScrollTop = this.container.scrollTop;
        this.container.addEventListener('scroll', this.onScroll, { passive: true });
        this.container.addEventListener('scrollend', this.onScrollEnd, { passive: true });
        this.setupResizeObserver();
        this.setupMutationObserver();
    }

    public disconnect(): void {
        this.container.removeEventListener('scroll', this.onScroll);
        this.container.removeEventListener('scrollend', this.onScrollEnd);
        if (this.slotChangeHandler) {
            this.defaultSlot.removeEventListener('slotchange', this.slotChangeHandler);
            this.slotChangeHandler = null;
        }
        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
    }

    private setupMutationObserver(): void {
        this.mutationObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if ((node as Element).tagName?.toLowerCase() === 'spright-chat-message-outbound') {
                        this.scrollToUserMessagePending = true;
                    }
                }
            }
            if (!this.scrollPending) {
                this.scrollPending = true;
                requestAnimationFrame(() => {
                    this.scrollPending = false;
                    if (!this.getAutoScroll()) {
                        return;
                    }
                    if (this.scrollToUserMessagePending) {
                        this.scrollToUserMessagePending = false;
                        this.scrollToLastMessageTop();
                    } else if (!this.isUserScrolledUp) {
                        this.updatePaddingAndScroll();
                    }
                });
            }
        });
        this.mutationObserver.observe(this.hostElement, { childList: true, subtree: true, characterData: true });
    }

    /**
     * Observes the scroll container and the last slotted element for size changes.
     * Reconnects the observer whenever the slot assignment changes so new messages are tracked.
     */
    private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            if (!this.isUserScrolledUp && this.getAutoScroll()) {
                this.updatePaddingAndScroll();
            }
        });
        this.resizeObserver.observe(this.container);
        this.slotChangeHandler = () => {
            this.resizeObserver?.disconnect();
            if (this.container instanceof Element) {
                this.resizeObserver?.observe(this.container);
            }
            const assigned = this.defaultSlot.assignedElements({ flatten: true });
            const lastEl = assigned[assigned.length - 1];
            if (lastEl) {
                this.resizeObserver?.observe(lastEl);
            }
        };
        this.defaultSlot.addEventListener('slotchange', this.slotChangeHandler);
    }

    /**
     * Shrinks the bottom padding incrementally as content grows to fill the space below
     * the pinned user message. Once padding reaches zero, scrolls to the bottom normally.
     */
    private updatePaddingAndScroll(): void {
        if (this.userMessageScrollTop > 0 && this.bottomPaddingPx > 0) {
            const contentHeight = this.container.scrollHeight - this.bottomPaddingPx;
            const neededPadding = Math.max(0, this.userMessageScrollTop + this.container.clientHeight - contentHeight);
            if (neededPadding < this.bottomPaddingPx) {
                this.container.style.paddingBottom = neededPadding > 0 ? `${neededPadding}px` : '';
                this.bottomPaddingPx = neededPadding;
            }
        }
        if (this.bottomPaddingPx === 0) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom(): void {
        this.container.scrollTop = this.container.scrollHeight;
    }

    private getLastOutboundMessage(): HTMLElement | null {
        const assigned = this.defaultSlot.assignedElements({ flatten: true });
        for (let i = assigned.length - 1; i >= 0; i--) {
            if (assigned[i]?.tagName.toLowerCase() === 'spright-chat-message-outbound') {
                return assigned[i] as HTMLElement;
            }
        }
        return null;
    }

    /**
     * Positions the last outbound message at the top of the visible viewport.
     * Uses bottom padding to prevent the content from being pushed up as the
     * response grows below.
     */
    private scrollToLastMessageTop(): void {
        const messageElement = this.getLastOutboundMessage();
        if (!messageElement) {
            return;
        }
        void this.container.scrollHeight;
        const containerRect = this.container.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        const messageTopInContent = this.container.scrollTop + (messageRect.top - containerRect.top);

        this.isUserScrolledUp = false;

        if (messageRect.height >= this.container.clientHeight / 2) {
            this.scrollToBottomOfTallMessage(messageTopInContent, messageRect.height);
        } else if (messageTopInContent <= 0) {
            this.resetPaddingForTopAlignedMessage();
        } else {
            this.scrollToMessageWithPadding(messageTopInContent, messageRect.height);
        }
    }

    private scrollToBottomOfTallMessage(messageTopInContent: number, messageHeight: number): void {
        const lineGap = Math.round(this.container.clientHeight * 0.2);
        const scrollTarget = Math.max(0, messageTopInContent + messageHeight - lineGap);
        const padding = this.container.clientHeight - lineGap;

        this.bottomPaddingPx = padding;
        this.userMessageScrollTop = scrollTarget;
        this.container.style.paddingBottom = padding > 0 ? `${padding}px` : '';
        void this.container.scrollHeight;

        this.previousScrollTop = scrollTarget;
        this.programmaticScrolling = true;
        this.container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }

    private resetPaddingForTopAlignedMessage(): void {
        if (this.bottomPaddingPx > 0) {
            this.container.style.paddingBottom = '';
            this.bottomPaddingPx = 0;
            this.userMessageScrollTop = 0;
        }
    }

    private scrollToMessageWithPadding(messageTopInContent: number, messageHeight: number): void {
        const topMargin = parseFloat(mediumPadding.getValueFor(this.hostElement));
        const scrollTarget = Math.max(0, messageTopInContent - topMargin);

        if (scrollTarget === 0) {
            this.resetPaddingForTopAlignedMessage();
            return;
        }

        const contentWithoutPadding = messageTopInContent + messageHeight;
        const newPadding = Math.max(0, scrollTarget + this.container.clientHeight - contentWithoutPadding);
        const preventClampPadding = Math.max(0, this.container.scrollTop + this.container.clientHeight - contentWithoutPadding);
        const safePadding = Math.max(newPadding, preventClampPadding);

        this.bottomPaddingPx = safePadding;
        this.userMessageScrollTop = scrollTarget;
        this.container.style.paddingBottom = safePadding > 0 ? `${safePadding}px` : '';
        void this.container.scrollHeight;

        this.previousScrollTop = scrollTarget;
        this.programmaticScrolling = true;
        this.container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    }

    private readonly onScrollEnd = (): void => {
        this.programmaticScrolling = false;
    };

    private readonly onScroll = (): void => {
        if (this.programmaticScrolling) {
            return;
        }
        const currentScrollTop = this.container.scrollTop;
        const distanceFromBottom = this.container.scrollHeight - this.bottomPaddingPx - currentScrollTop - this.container.clientHeight;
        if (currentScrollTop < this.previousScrollTop && distanceFromBottom > this.scrollingPixelThreshold) {
            this.isUserScrolledUp = true;
        } else if (distanceFromBottom <= this.scrollingPixelThreshold) {
            this.isUserScrolledUp = false;
        }
        this.previousScrollTop = currentScrollTop;
    };
}
