import type { ChatMessageToolSummary } from '..';

/**
 * Page object for `spright-chat-message-tool-summary`.
 */
export class ChatMessageToolSummaryPageObject {
    public constructor(private readonly element: ChatMessageToolSummary) {}

    public get disclosureButton(): HTMLButtonElement | null {
        return this.element.shadowRoot?.querySelector('.summary-button') ?? null;
    }

    public get summaryText(): string | null {
        return this.element.shadowRoot?.querySelector('.summary-label')?.textContent?.trim() ?? null;
    }

    public get list(): HTMLElement | null {
        return this.element.shadowRoot?.querySelector('.tool-call-list') ?? null;
    }

    public get assignedElements(): Element[] {
        const slot = this.list?.querySelector('slot');
        return slot?.assignedElements() ?? [];
    }
}