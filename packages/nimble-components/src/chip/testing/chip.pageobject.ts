import type { Chip } from '..';
import type { Button } from '../../button';

/**
 * Page object for the `nimble-chip` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ChipPageObject {
    public constructor(protected readonly chipElement: Chip) {}

    public isRemoveButtonVisible(): boolean {
        const removeButton = this.getRemoveButton();
        return removeButton ? removeButton !== null : false;
    }

    public getRemoveButtonTextContent(): string {
        const removeButton = this.getRemoveButton();
        return removeButton?.textContent?.trim() ?? '';
    }

    public clickRemoveButton(): void {
        const removeButton = this.getRemoveButton();
        if (removeButton) {
            removeButton.click();
        } else {
            throw new Error('Remove button not found');
        }
    }

    public getRemoveButtonTabIndex(): string | null {
        const removeButton = this.getRemoveButton();
        if (removeButton) {
            return removeButton.getAttribute('tabindex');
        }
        throw new Error('Remove button not found');
    }

    private getRemoveButton(): Button | null {
        return (
            this.chipElement.shadowRoot?.querySelector<Button>(
                '.remove-button'
            ) ?? null
        );
    }
}
