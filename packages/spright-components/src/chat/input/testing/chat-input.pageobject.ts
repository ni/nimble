import { keyEnter } from '@ni/fast-web-utilities';
import { Button } from '@ni/nimble-components/dist/esm/button';
import {
    processUpdates,
    waitForUpdatesAsync
} from '@ni/nimble-components/dist/esm/testing/async-helpers';
import { sendKeyDownEvent } from '@ni/nimble-components/dist/esm/utilities/testing/component';
import type { ChatInput } from '..';

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

    public getSendButtonTextContent(): string {
        return this.getSendButton().textContent?.trim() ?? '';
    }

    public textAreaHasFocus(): boolean {
        return (
            document.activeElement === this.element
            && this.element.shadowRoot?.activeElement === this.element.textArea
        );
    }

    public getPlaceholder(): string {
        if (this.element.textArea!.value) {
            throw Error('Placeholder not visible');
        }
        return this.element.textArea!.placeholder;
    }

    public getRenderedText(): string {
        return this.element.textArea!.value;
    }

    public setText(text: string): void {
        this.element.textArea!.focus();
        this.element.textArea!.value = text;
        this.element.textAreaInputHandler();
        processUpdates();
    }

    public async pressEnterKey(): Promise<void> {
        this.element.textArea!.focus();
        await this.sendEnterKeyEvents(false);
    }

    public async pressShiftEnterKey(): Promise<void> {
        this.element.textArea!.focus();
        await this.sendEnterKeyEvents(true);
    }

    private getSendButton(): Button {
        const sendButton = this.element.shadowRoot!.querySelector<Button>('.send-button')!;
        return sendButton;
    }

    private async sendEnterKeyEvents(shiftKey: boolean): Promise<void> {
        const keyDownEvent = await sendKeyDownEvent(
            this.element.textArea!,
            keyEnter,
            { shiftKey }
        );
        if (!keyDownEvent.defaultPrevented) {
            this.element.textArea!.value += '\n';
            this.element.textArea!.dispatchEvent(new InputEvent('input'));
        }

        await waitForUpdatesAsync();
    }
}
