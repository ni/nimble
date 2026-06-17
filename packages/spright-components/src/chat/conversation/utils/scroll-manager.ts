import { mediumPadding } from '@ni/nimble-components/dist/esm/theme-provider/design-tokens';
import { chatMessageOutboundTag } from '../../message/outbound';
import { ChatConversationScrollApi } from './scroll-api';

/**
 * Encapsulates all scroll management logic for the ChatConversation component.
 * Interacts with ChatConversation through the scroll API abstraction.
 */
export class ChatConversationScrollManager {
    // Distance from the bottom (px) within which the user is considered "at the bottom".
    private readonly scrollingPixelThreshold = 10;
    // True when the user has manually scrolled up; suppresses auto-scroll until they return to the bottom.
    private isUserScrolledUp = false;
    // Deduplicates multiple mutation callbacks within the same animation frame.
    private scrollPending = false;
    // Current bottom padding (px) applied to the scroll container to hold the user message in place.
    private bottomPaddingPx = 0;
    // The scrollTop at which the last user message sits at the top of the viewport.
    private userMessageScrollTop = 0;
    // ScrollTop recorded after the last scroll event, used to detect scroll direction.
    private previousScrollTop = 0;
    // True while a programmatic smooth scroll is in progress; prevents treating it as a user scroll.
    private programmaticScrolling = false;
    // True when the latest conversation content is visible in the viewport.
    private isConversationEndVisible = true;
    private pendingMessages: Element[] = [];

    public constructor(
        private readonly api: ChatConversationScrollApi,
        private readonly hostElement: HTMLElement
    ) {}

    public connect(): void {
        const dims = this.api.getScrollContainerDimensions();
        this.previousScrollTop = dims.scrollTop;
        this.isConversationEndVisible = this.api.getIsConversationEndVisible();

        this.api.onMessageAdded(element => {
            this.pendingMessages.push(element);
            if (!this.scrollPending) {
                this.scrollPending = true;
                requestAnimationFrame(() => {
                    this.scrollPending = false;
                    const hasUserMessage = this.pendingMessages.some(el => this.isUserMessage(el));
                    this.pendingMessages = [];
                    if (hasUserMessage) {
                        this.scrollToLastMessageTop();
                    } else if (!this.isUserScrolledUp) {
                        this.updatePaddingAndScroll();
                    }
                });
            }
        });

        this.api.onUserScroll(scrollTop => {
            this.onScroll(scrollTop);
        });

        this.api.onContentSizeChanged(() => {
            if (!this.isUserScrolledUp && (this.bottomPaddingPx > 0 || this.isConversationEndVisible)) {
                this.updatePaddingAndScroll();
            }
        });

        this.api.onConversationEndVisibilityChanged(isVisible => {
            this.isConversationEndVisible = isVisible;
        });
    }

    public disconnect(): void {
        this.api.unsubscribeAll();
    }

    private isUserMessage(element: Element): boolean {
        return element.tagName?.toLowerCase() === chatMessageOutboundTag;
    }

    /**
     * Shrinks the bottom padding incrementally as content grows to fill the space below
     * the pinned user message. Once padding reaches zero, scrolls to the bottom normally.
     */
    private updatePaddingAndScroll(): void {
        if (this.userMessageScrollTop > 0 && this.bottomPaddingPx > 0) {
            const dims = this.api.getScrollContainerDimensions();
            const contentHeight = dims.scrollHeight - this.bottomPaddingPx;
            const neededPadding = Math.max(0, this.userMessageScrollTop + dims.clientHeight - contentHeight);
            if (neededPadding !== this.bottomPaddingPx) {
                this.api.setBottomPadding(neededPadding);
                this.bottomPaddingPx = neededPadding;
            }
        }
        if (this.bottomPaddingPx === 0) {
            this.scrollToBottom();
        }
    }

    private scrollToBottom(): void {
        const dims = this.api.getScrollContainerDimensions();
        this.api.setScrollPosition(dims.scrollHeight, false);
    }

    /**
     * Positions the last outbound message at the top of the visible viewport.
     * Uses bottom padding to prevent the content from being pushed up as the
     * response grows below.
     */
    private scrollToLastMessageTop(): void {
        const geometry = this.api.getLastOutboundMessageGeometry();
        if (!geometry) {
            return;
        }

        this.isUserScrolledUp = false;
        const dims = this.api.getScrollContainerDimensions();

        if (geometry.height >= dims.clientHeight / 2) {
            this.scrollToBottomOfTallMessage(geometry.top, geometry.height);
        } else if (geometry.top <= 0) {
            this.resetPaddingForTopAlignedMessage();
        } else {
            this.scrollToMessageWithPadding(geometry.top, geometry.height);
        }
    }

    private scrollToBottomOfTallMessage(messageTopInContent: number, messageHeight: number): void {
        const dims = this.api.getScrollContainerDimensions();
        const lineGap = Math.round(dims.clientHeight * 0.2);
        const scrollTarget = Math.max(0, messageTopInContent + messageHeight - lineGap);
        const padding = dims.clientHeight - lineGap;

        this.bottomPaddingPx = padding;
        this.userMessageScrollTop = scrollTarget;
        this.api.setBottomPadding(padding);

        this.previousScrollTop = scrollTarget;
        this.programmaticScrolling = true;
        this.api.setScrollPosition(scrollTarget, true);

        setTimeout(() => {
            this.programmaticScrolling = false;
        }, 500);
    }

    private resetPaddingForTopAlignedMessage(): void {
        if (this.bottomPaddingPx > 0) {
            this.api.setBottomPadding(0);
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

        const dims = this.api.getScrollContainerDimensions();
        const contentWithoutPadding = messageTopInContent + messageHeight;
        const newPadding = Math.max(0, scrollTarget + dims.clientHeight - contentWithoutPadding);
        const preventClampPadding = Math.max(0, dims.scrollTop + dims.clientHeight - contentWithoutPadding);
        const safePadding = Math.max(newPadding, preventClampPadding);

        this.bottomPaddingPx = safePadding;
        this.userMessageScrollTop = scrollTarget;
        this.api.setBottomPadding(safePadding);

        this.previousScrollTop = scrollTarget;
        this.programmaticScrolling = true;
        this.api.setScrollPosition(scrollTarget, true);

        setTimeout(() => {
            this.programmaticScrolling = false;
        }, 500);
    }

    private readonly onScroll = (currentScrollTop: number): void => {
        if (this.programmaticScrolling) {
            return;
        }
        const distanceFromBottom = this.api.getDistanceFromBottom();
        if (currentScrollTop < this.previousScrollTop && distanceFromBottom > this.scrollingPixelThreshold) {
            this.isUserScrolledUp = true;
        } else if (distanceFromBottom <= this.scrollingPixelThreshold) {
            this.isUserScrolledUp = false;
        }
        this.previousScrollTop = currentScrollTop;
    };
}
