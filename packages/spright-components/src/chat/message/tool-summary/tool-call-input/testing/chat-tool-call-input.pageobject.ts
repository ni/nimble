import type { ChatToolCallInput } from '..';

/**
 * Page object for `spright-chat-tool-call-input`.
 */
export class ChatToolCallInputPageObject {
    public constructor(private readonly element: ChatToolCallInput) {}

    public get nameText(): string | null {
        return this.element.shadowRoot?.querySelector('.input-name')?.textContent ?? null;
    }

    public get valueText(): string {
        return this.element.shadowRoot?.querySelector('.input-value')?.textContent ?? '';
    }
}