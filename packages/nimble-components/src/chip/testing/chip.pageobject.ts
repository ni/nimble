import type { Chip } from '..';
import type { Button } from '../../button';
import type { ToggleButton } from '../../toggle-button';

/**
 * Page object for the `nimble-chip` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ChipPageObject {
    public constructor(protected readonly chipElement: Chip) {}

    public isRemoveButtonVisible(): boolean {
        const removeButton = this.getRemoveButton();
        return !!removeButton;
    }

    public clickToggleButton(): void {
        const toggleButton = this.getToggleButton();
        if (toggleButton) {
            toggleButton.control.click();
        } else {
            throw new Error('Toggle button not found');
        }
    }

    public pressToggleButtonKey(key: string): void {
        const toggleButton = this.getToggleButton();
        if (toggleButton) {
            toggleButton.control.dispatchEvent(
                new KeyboardEvent('keypress', { key })
            );
        } else {
            throw new Error('Toggle button not found');
        }
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

    public getRemoveButtonTabIndex(): number | null {
        const removeButton = this.getRemoveButton();
        if (removeButton) {
            return removeButton.shadowRoot?.querySelector<HTMLButtonElement>(
                '.control'
            )?.tabIndex ?? null;
        }
        throw new Error('Remove button not found');
    }

    public getToggleButtonTabIndex(): string | null {
        const toggleButton = this.getToggleButton();
        if (toggleButton) {
            return toggleButton.control.getAttribute('tabindex');
        }
        throw new Error('Toggle button not found');
    }

    public mousedownRemoveButton(): void {
        const removeButton = this.getRemoveButton();
        if (removeButton) {
            removeButton.dispatchEvent(
                new MouseEvent('mousedown', { bubbles: true })
            );
        } else {
            throw new Error('Remove button not found');
        }
    }

    private getRemoveButton(): Button | null {
        return (
            this.chipElement.shadowRoot?.querySelector<Button>(
                '.remove-button'
            ) ?? null
        );
    }

    private getToggleButton(): ToggleButton | null {
        return (
            this.chipElement.shadowRoot?.querySelector<ToggleButton>(
                '.toggle-button'
            ) ?? null
        );
    }
}
