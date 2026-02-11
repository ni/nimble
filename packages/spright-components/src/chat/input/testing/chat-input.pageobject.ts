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

    public isButtonEnabled(): boolean {
        return !this.getActionButton().disabled;
    }

    public isProcessing(): boolean {
        return this.element.processing;
    }

    public isTextAreaFocused(): boolean {
        return this.element.textArea === this.element.shadowRoot?.activeElement;
    }

    public clickSendButton(): void {
        if (!this.element.processing) {
            this.getActionButton().click();
        }
    }

    public clickStopButton(): void {
        if (this.element.processing) {
            this.getActionButton().click();
        }
    }

    public getButtonTitle(): string {
        return this.getActionButton().title;
    }

    public getButtonTextContent(): string {
        return this.getActionButton().textContent?.trim() ?? '';
    }

    public getButtonTabIndex(): string | null {
        return this.getActionButton().getAttribute('tabindex');
    }

    public textAreaHasFocus(): boolean {
        return (
            document.activeElement === this.element
            && this.element.shadowRoot?.activeElement === this.element.textArea
        );
    }

    public getTextAreaTabIndex(): string | null {
        return this.element.textArea!.getAttribute('tabindex');
    }

    public getTextAreaMaxLength(): number | null {
        return this.element.textArea!.maxLength;
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

    private getActionButton(): Button {
        const actionButton = this.element.shadowRoot!.querySelector<Button>('.action-button')!;
        return actionButton;
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
