import type { FoundationElement } from '@ni/fast-foundation';
import { processUpdates } from '../../../testing/async-helpers';

/**
 * A page object for the elements that use the error pattern mixin.
 */
export class SeverityPatternPageObject {
    public constructor(private readonly element: FoundationElement) {}

    public getDisplayedSeverityText(): string {
        const severityTextDiv = this.getSeverityTextElement();
        if (
            !severityTextDiv
            || getComputedStyle(severityTextDiv).display === 'none'
        ) {
            return '';
        }
        return severityTextDiv.textContent?.trim() ?? '';
    }

    public getSeverityTextTitle(): string {
        const severityTextDiv = this.getSeverityTextElement();
        if (!severityTextDiv) {
            throw new Error('Severity text element not found');
        }
        return severityTextDiv.title;
    }

    public dispatchEventToSeverityText(event: MouseEvent): void {
        const severityTextDiv = this.getSeverityTextElement();
        if (!severityTextDiv) {
            throw new Error('Severity text element not found');
        }
        severityTextDiv.dispatchEvent(event);
        processUpdates();
    }

    private getSeverityTextElement(): HTMLDivElement | null {
        return this.element.shadowRoot!.querySelector('.severity-text');
    }
}
