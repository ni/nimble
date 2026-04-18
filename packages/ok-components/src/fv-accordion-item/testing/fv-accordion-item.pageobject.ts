import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import type { FvAccordionItem } from '..';

/**
 * Page object for the `ok-fv-accordion-item` component to provide consistent
 * ways of querying and interacting with the component during tests.
 */
export class FvAccordionItemPageObject {
    public constructor(protected readonly accordionItemElement: FvAccordionItem) {}

    public async clickSummary(): Promise<void> {
        this.getSummary().click();
        await waitForUpdatesAsync();
    }

    public getHeaderText(): string {
        return this.getTitle().textContent?.trim() ?? '';
    }

    public isExpanded(): boolean {
        return this.getDetails().open;
    }

    public hasContentSlot(): boolean {
        return !!this.accordionItemElement.shadowRoot?.querySelector('slot');
    }

    public hasExpanderIcon(): boolean {
        return !!this.accordionItemElement.shadowRoot?.querySelector(
            'nimble-icon-arrow-expander-right'
        );
    }

    private getDetails(): HTMLDetailsElement {
        const details = this.accordionItemElement.shadowRoot?.querySelector('details');
        if (!details) {
            throw new Error('Accordion item details element not found');
        }
        return details;
    }

    private getSummary(): HTMLElement {
        const summary = this.accordionItemElement.shadowRoot?.querySelector<HTMLElement>(
            '.accordion-item-summary'
        );
        if (!summary) {
            throw new Error('Accordion item summary element not found');
        }
        return summary;
    }

    private getTitle(): HTMLElement {
        const title = this.accordionItemElement.shadowRoot?.querySelector<HTMLElement>(
            '.accordion-item-title'
        );
        if (!title) {
            throw new Error('Accordion item title element not found');
        }
        return title;
    }
}