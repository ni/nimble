import type { FoundationElement } from '@microsoft/fast-foundation';
import { processUpdates } from '../../../testing/async-helpers';

/**
 * A page object for the elements that use the error pattern mixin.
 */
export class ErrorPatternPageObject {
    public constructor(private readonly element: FoundationElement) {}

    public isErrorIconVisible(): boolean {
        const icon = this.getErrorIconElement();
        if (!icon) {
            return false;
        }
        return getComputedStyle(icon).display !== 'none';
    }

    public getDisplayedErrorText(): string {
        const errorTextDiv = this.getErrorTextElement();
        if (
            !errorTextDiv
            || getComputedStyle(errorTextDiv).display === 'none'
        ) {
            return '';
        }
        return errorTextDiv.textContent?.trim() ?? '';
    }

    public getErrorTextTitle(): string {
        const errorTextDiv = this.getErrorTextElement();
        if (!errorTextDiv) {
            throw new Error('Error text element not found');
        }
        return errorTextDiv.title;
    }

    public dispatchEventToErrorText(event: MouseEvent): void {
        const errorTextDiv = this.getErrorTextElement();
        if (!errorTextDiv) {
            throw new Error('Error text element not found');
        }
        errorTextDiv.dispatchEvent(event);
        processUpdates();
    }

    private getErrorIconElement(): HTMLElement | null {
        return this.element.shadowRoot!.querySelector('.error-icon');
    }

    private getErrorTextElement(): HTMLDivElement | null {
        return this.element.shadowRoot!.querySelector('.error-text');
    }
}
