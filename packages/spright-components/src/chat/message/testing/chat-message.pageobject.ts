import type { ChatMessageInbound } from '../inbound';
import type { ChatMessageOutbound } from '../outbound';
import type { ChatMessageSystem } from '../system';

type ChatMessageElement = ChatMessageInbound | ChatMessageOutbound | ChatMessageSystem;

/**
 * Page object for the chat message components (`spright-chat-message-inbound`,
 * `spright-chat-message-outbound`, and `spright-chat-message-system`) to provide
 * consistent ways of querying the component during tests.
 */
export class ChatMessagePageObject {
    public constructor(protected readonly element: ChatMessageElement) {}

    public getRenderedText(): string {
        const assigned = this.getContentSlot()?.assignedNodes({ flatten: true }) ?? [];
        return assigned
            .map(node => node.textContent ?? '')
            .join('')
            .trim();
    }

    public isContentRendered(): boolean {
        return this.getRenderedText().length > 0;
    }

    public isScrollAnchor(): boolean {
        return this.element.messageInternals.isScrollAnchor;
    }

    private getContentSlot(): HTMLSlotElement | null {
        return (
            this.element.shadowRoot?.querySelector<HTMLSlotElement>(
                '.message-content slot'
            ) ?? null
        );
    }
}
