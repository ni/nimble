import { chatMessageOutboundTag } from '../../message/outbound';

/**
 * ChatConversation-backed API for scroll management.
 */
export class ChatConversationScrollApi {
    private messageAddedCallbacks: ((element: Element) => void)[] = [];
    private userScrollCallbacks: ((scrollTop: number) => void)[] = [];
    private contentSizeChangedCallbacks: (() => void)[] = [];
    private endVisibilityChangedCallbacks: ((isVisible: boolean) => void)[] = [];
    private mutationObserver: MutationObserver | null = null;
    private resizeObserver: ResizeObserver | null = null;
    private intersectionObserver: IntersectionObserver | null = null;
    private scrollListener: (() => void) | null = null;
    private slotChangeHandler: (() => void) | null = null;
    private currentBottomPaddingPx = 0;
    private isConversationEndVisible = true;

    public constructor(
        private readonly scrollContainer: HTMLElement,
        private readonly hostElement: HTMLElement,
        private readonly defaultSlot: HTMLSlotElement
    ) {}

    public getLastOutboundMessageGeometry(): { top: number, height: number } | null {
        const messageElement = this.getLastOutboundMessage();
        if (!messageElement) {
            return null;
        }

        const containerRect = this.scrollContainer.getBoundingClientRect();
        const messageRect = messageElement.getBoundingClientRect();
        const messageTopInContent = this.scrollContainer.scrollTop + (messageRect.top - containerRect.top);

        return {
            top: messageTopInContent,
            height: messageRect.height
        };
    }

    public getScrollContainerDimensions(): {
        scrollTop: number,
        scrollHeight: number,
        clientHeight: number
    } {
        return {
            scrollTop: this.scrollContainer.scrollTop,
            scrollHeight: this.scrollContainer.scrollHeight,
            clientHeight: this.scrollContainer.clientHeight
        };
    }

    public getDistanceFromBottom(): number {
        const { scrollTop, scrollHeight, clientHeight } = this.getScrollContainerDimensions();
        return scrollHeight - this.currentBottomPaddingPx - scrollTop - clientHeight;
    }

    public setScrollPosition(scrollTop: number, smooth?: boolean): void {
        if (smooth) {
            this.scrollContainer.scrollTo({ top: scrollTop, behavior: 'smooth' });
        } else {
            this.scrollContainer.scrollTop = scrollTop;
        }
    }

    public setBottomPadding(paddingPx: number): void {
        this.currentBottomPaddingPx = paddingPx;
        if (paddingPx > 0) {
            this.scrollContainer.style.paddingBottom = `${paddingPx}px`;
        } else {
            this.scrollContainer.style.paddingBottom = '';
        }
    }

    public onMessageAdded(callback: (element: Element) => void): void {
        this.messageAddedCallbacks.push(callback);
        if (!this.mutationObserver) {
            this.setupMutationObserver();
        }
    }

    public onUserScroll(callback: (scrollTop: number) => void): void {
        this.userScrollCallbacks.push(callback);
        if (!this.scrollListener) {
            this.setupScrollListener();
        }
    }

    public onContentSizeChanged(callback: () => void): void {
        this.contentSizeChangedCallbacks.push(callback);
        if (!this.resizeObserver) {
            this.setupResizeObserver();
        }
    }

    public onConversationEndVisibilityChanged(callback: (isVisible: boolean) => void): void {
        this.endVisibilityChangedCallbacks.push(callback);
        if (!this.intersectionObserver) {
            this.setupIntersectionObserver();
        }
        callback(this.isConversationEndVisible);
    }

    public getIsConversationEndVisible(): boolean {
        return this.isConversationEndVisible;
    }

    public unsubscribeAll(): void {
        this.messageAddedCallbacks = [];
        this.userScrollCallbacks = [];
        this.contentSizeChangedCallbacks = [];
        this.endVisibilityChangedCallbacks = [];
        this.mutationObserver?.disconnect();
        this.resizeObserver?.disconnect();
        this.intersectionObserver?.disconnect();
        if (this.scrollListener) {
            this.scrollContainer.removeEventListener('scroll', this.scrollListener);
        }
        if (this.slotChangeHandler) {
            this.defaultSlot.removeEventListener('slotchange', this.slotChangeHandler);
            this.slotChangeHandler = null;
        }
        this.mutationObserver = null;
        this.resizeObserver = null;
        this.intersectionObserver = null;
        this.scrollListener = null;
    }

    private getLastOutboundMessage(): HTMLElement | null {
        const assigned = this.defaultSlot.assignedElements({ flatten: true });
        return Array.from(assigned).reverse().find(el => this.isUserMessage(el)) as HTMLElement | null;
    }

    private isUserMessage(element: Element): boolean {
        return element.tagName?.toLowerCase() === chatMessageOutboundTag;
    }

    private setupMutationObserver(): void {
        this.mutationObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    const element = node as Element;
                    for (const callback of this.messageAddedCallbacks) {
                        callback(element);
                    }
                }
            }
        });
        this.mutationObserver.observe(this.hostElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    private setupResizeObserver(): void {
        this.resizeObserver = new ResizeObserver(() => {
            for (const callback of this.contentSizeChangedCallbacks) {
                callback();
            }
            this.observeConversationEnd();
        });
        this.resizeObserver.observe(this.scrollContainer);
        this.observeLastAssignedElement();

        this.slotChangeHandler = () => {
            this.resizeObserver?.disconnect();
            this.resizeObserver?.observe(this.scrollContainer);
            this.observeLastAssignedElement();
            this.observeConversationEnd();
        };
        this.defaultSlot.addEventListener('slotchange', this.slotChangeHandler);
    }

    private setupIntersectionObserver(): void {
        this.intersectionObserver = new IntersectionObserver(entries => {
            const entry = entries[entries.length - 1];
            const isVisible = entry?.isIntersecting ?? false;
            if (isVisible !== this.isConversationEndVisible) {
                this.isConversationEndVisible = isVisible;
                for (const callback of this.endVisibilityChangedCallbacks) {
                    callback(isVisible);
                }
            }
        }, {
            root: this.scrollContainer,
            threshold: 0.01
        });

        this.observeConversationEnd();
    }

    private observeConversationEnd(): void {
        if (!this.intersectionObserver) {
            return;
        }

        this.intersectionObserver.disconnect();
        const assigned = this.defaultSlot.assignedElements({ flatten: true });
        const lastEl = assigned[assigned.length - 1];
        if (lastEl) {
            this.intersectionObserver.observe(lastEl);
        } else if (!this.isConversationEndVisible) {
            this.isConversationEndVisible = true;
            for (const callback of this.endVisibilityChangedCallbacks) {
                callback(true);
            }
        }
    }

    private observeLastAssignedElement(): void {
        const assigned = this.defaultSlot.assignedElements({ flatten: true });
        const lastEl = assigned[assigned.length - 1];
        if (lastEl) {
            this.resizeObserver?.observe(lastEl);
        }
    }

    private setupScrollListener(): void {
        this.scrollListener = () => {
            for (const callback of this.userScrollCallbacks) {
                callback(this.scrollContainer.scrollTop);
            }
        };
        this.scrollContainer.addEventListener('scroll', this.scrollListener, { passive: true });
    }
}
