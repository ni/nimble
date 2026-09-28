import type { ChatToolCall } from '..';

/**
 * Page object for `spright-chat-tool-call`.
 */
export class ChatToolCallPageObject {
    public constructor(private readonly element: ChatToolCall) {}

    public get nameText(): string {
        return this.element.shadowRoot?.querySelector('.tool-name')?.textContent ?? '';
    }

    public get statusText(): string {
        return this.element.shadowRoot?.querySelector('.status-label')?.textContent ?? '';
    }

    public get inputElements(): Element[] {
        const slot = this.element.shadowRoot?.querySelector<HTMLSlotElement>('.input-list slot');
        return slot?.assignedElements() ?? [];
    }
}