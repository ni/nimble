import { keyEnter } from '@ni/fast-web-utilities';
import { Button } from '@ni/nimble-components/dist/esm/button';
import type { ChatInput } from '..';
import { processUpdates } from '@ni/nimble-components/dist/esm/testing/async-helpers';

/**
 * Page object for the `spright-chat-input` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ChatInputPageObject {
    public constructor(protected readonly element: ChatInput) {}

    public isSendButtonEnabled(): boolean {
        return !this.getSendButton().disabled;
    }

    public clickSendButton(): void {
        this.getSendButton().click();
    }

    public getSendButtonTitle(): string {
        return this.getSendButton().title;
    }

    public getSendButtonAriaLabel(): string | null {
        return this.getSendButton().ariaLabel;
    }

    public getPlaceholder(): string {
        if (this.element.textArea.value) {
            throw Error('Placeholder not visible');
        }
        return this.element.textArea.placeholder;
    }

    public getRenderedText(): string {
        return this.element.textArea.value;
    }

    public setText(text: string): void {
        this.element.textArea.focus();
        this.element.textArea.value = text;
        this.element.textAreaInputHandler();
        processUpdates();
    }

    public pressEnterKey(): void {
        this.element.textArea.focus();
        this.element.textArea.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    public pressShiftEnterKey(): void {
        this.element.textArea.focus();
        this.element.textArea.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    private getSendButton(): Button {
        const sendButton = this.element.shadowRoot!.querySelector<Button>('.send-button')!;
        return sendButton;
    }
}
