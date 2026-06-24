import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import type { ChatConversation } from '..';
import { chatMessageInboundTag } from '../../message/inbound';
import { chatMessageOutboundTag } from '../../message/outbound';
import { chatMessageSystemTag } from '../../message/system';

/**
 * Page object for the `spright-chat-conversation` component to provide consistent
 * ways of querying and interacting with the component during tests. Methods expose
 * primitive values rather than elements so tests do not depend on internal structure.
 */
export class ChatConversationPageObject {
    public constructor(protected readonly element: ChatConversation) {}

    // --- slots ---

    public hasDefaultSlot(): boolean {
        return this.queryShadow('.messages slot:not([name])') !== undefined;
    }

    public hasNamedSlot(name: string): boolean {
        return this.queryShadow(`slot[name="${name}"]`) !== undefined;
    }

    public getNamedSlotAssignedElementCount(name: string): number {
        const slot = this.queryShadow(`slot[name="${name}"]`) as
            | HTMLSlotElement
            | undefined;
        return slot?.assignedElements().length ?? 0;
    }

    // --- messages ---

    public getMessageCount(): number {
        return this.getMessages().length;
    }

    public getMessageTextByIndex(index: number): string {
        const message = this.getMessages()[index];
        if (message === undefined) {
            throw new Error(`No message at index ${index}`);
        }
        return message.textContent?.trim() ?? '';
    }

    public getLastMessageText(): string {
        return this.getMessageTextByIndex(this.getMessageCount() - 1);
    }

    public isMessageOutboundByIndex(index: number): boolean {
        const message = this.getMessages()[index];
        return message?.tagName.toLowerCase() === chatMessageOutboundTag;
    }

    // --- scroll metrics ---

    public getScrollTop(): number {
        return this.getScrollContainer().scrollTop;
    }

    public getScrollHeight(): number {
        return this.getScrollContainer().scrollHeight;
    }

    public getClientHeight(): number {
        return this.getScrollContainer().clientHeight;
    }

    public isAnchorRegionReserved(): boolean {
        return this.element.autoScrollManager.anchorActive;
    }

    public getHistoryRegionMessageCount(): number {
        return this.getNamedSlotAssignedElementCount('history');
    }

    public getAnchoredRegionMessageCount(): number {
        const slot = this.queryShadow('.messages-anchored slot') as
            | HTMLSlotElement
            | undefined;
        return slot?.assignedElements().length ?? 0;
    }

    public getMessageSlotByIndex(index: number): string {
        const message = this.getMessages()[index];
        return message?.getAttribute('slot') ?? '';
    }

    public getAnchoredRegionHeight(): number {
        const region = this.queryShadow('.messages-anchored') as
            | HTMLElement
            | undefined;
        return region?.clientHeight ?? 0;
    }

    public getMessageViewportTop(index: number): number {
        const message = this.getMessages()[index];
        if (message === undefined) {
            throw new Error(`No message at index ${index}`);
        }
        const container = this.getScrollContainer();
        return (
            message.getBoundingClientRect().top
            - container.getBoundingClientRect().top
        );
    }

    public isMessagePinnedNearTop(index: number, tolerance = 48): boolean {
        return Math.abs(this.getMessageViewportTop(index)) <= tolerance;
    }

    public getDistanceFromBottom(): number {
        const container = this.getScrollContainer();
        return (
            container.scrollHeight - container.scrollTop - container.clientHeight
        );
    }

    public isScrolledToBottom(threshold = 10): boolean {
        return this.getDistanceFromBottom() <= threshold;
    }

    // --- auto-scroll state ---

    public isAutoScrollEnabled(): boolean {
        return this.element.autoScroll;
    }

    public isAutoScrollConnected(): boolean {
        return this.element.autoScrollManager.isActive;
    }

    public isAutoScrollEngaged(): boolean {
        return this.element.autoScrollManager.autoScrollEngaged;
    }

    public isMessageScrollAnchorByIndex(index: number): boolean {
        const message = this.getMessages()[index] as unknown as
            | { messageInternals?: { isScrollAnchor: boolean } }
            | undefined;
        return message?.messageInternals?.isScrollAnchor ?? false;
    }

    // --- actions ---

    public async appendOutboundMessage(text: string): Promise<void> {
        await this.appendMessage(chatMessageOutboundTag, text);
    }

    public async appendInboundMessage(text: string): Promise<void> {
        await this.appendMessage(chatMessageInboundTag, text);
    }

    public async appendSystemMessage(text: string): Promise<void> {
        await this.appendMessage(chatMessageSystemTag, text);
    }

    public async appendTextToLastMessage(text: string): Promise<void> {
        const messages = this.getMessages();
        const lastMessage = messages[messages.length - 1];
        if (lastMessage === undefined) {
            throw new Error('No message to append text to');
        }
        lastMessage.textContent = `${lastMessage.textContent ?? ''}${text}`;
        await this.waitForScrollUpdateAsync();
    }

    public async setViewportHeight(height: number): Promise<void> {
        this.element.style.height = `${height}px`;
        await this.waitForScrollUpdateAsync();
    }

    public async setAutoScrollEnabled(enabled: boolean): Promise<void> {
        this.element.autoScroll = enabled;
        await this.waitForScrollUpdateAsync();
    }

    public async scrollToOffset(offset: number): Promise<void> {
        this.getScrollContainer().scrollTop = offset;
        await this.waitForScrollUpdateAsync();
    }

    public async scrollByOffset(delta: number): Promise<void> {
        this.getScrollContainer().scrollTop += delta;
        await this.waitForScrollUpdateAsync();
    }

    public async scrollToBottom(): Promise<void> {
        await this.scrollToOffset(this.getScrollHeight());
    }

    /**
     * Waits for FAST updates plus two animation frames so reactions driven by
     * `requestAnimationFrame` and `ResizeObserver` (used by scroll management)
     * have settled.
     */
    public async waitForScrollUpdateAsync(): Promise<void> {
        await waitForUpdatesAsync();
        await this.nextAnimationFrameAsync();
        await this.nextAnimationFrameAsync();
        await waitForUpdatesAsync();
    }

    private async nextAnimationFrameAsync(): Promise<void> {
        await new Promise<void>(resolve => {
            requestAnimationFrame(() => resolve());
        });
    }

    private async appendMessage(tag: string, text: string): Promise<void> {
        const message = document.createElement(tag);
        message.textContent = text;
        this.element.appendChild(message);
        await this.waitForScrollUpdateAsync();
    }

    private getMessages(): Element[] {
        const history = this.queryShadow('slot[name="history"]') as
            | HTMLSlotElement
            | undefined;
        const anchored = this.queryShadow('.messages-anchored slot') as
            | HTMLSlotElement
            | undefined;
        return [
            ...(history?.assignedElements({ flatten: true }) ?? []),
            ...(anchored?.assignedElements({ flatten: true }) ?? [])
        ];
    }

    private getScrollContainer(): HTMLElement {
        const container = this.queryShadow('.messages') as
            | HTMLElement
            | undefined;
        if (container === undefined) {
            throw new Error('Scroll container not found');
        }
        return container;
    }

    private queryShadow(selector: string): Element | undefined {
        return this.element.shadowRoot?.querySelector(selector) ?? undefined;
    }
}
