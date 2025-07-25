import type { Chip } from '..';
import type { Button } from '../../button';

/**
 * Page object for the `nimble-chip` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ChipPageObject {
    public constructor(protected readonly chipElement: Chip) {}

    public clickRemoveButton(): void {
        const removeButton = this.chipElement.shadowRoot?.querySelector<Button>('.remove-button');
        if (removeButton) {
            removeButton.click();
        } else {
            throw new Error('Remove button not found');
        }
    }
}
