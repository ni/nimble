import { waitForUpdatesAsync } from '@ni/nimble-components/dist/esm/testing/async-helpers';
import type { FvSearchInput } from '..';

/**
 * Page object for the `ok-fv-search-input` component to provide consistent
 * ways of querying and interacting with the component during tests.
 */
export class FvSearchInputPageObject {
    public constructor(
        protected readonly searchInputElement: FvSearchInput
    ) {}

    public getInputValue(): string {
        return this.getInput().value;
    }

    public getPlaceholder(): string {
        return this.getInput().placeholder;
    }

    public getInputAriaLabel(): string | null {
        return this.getInput().getAttribute('aria-label');
    }

    public getInputAriaLabelledby(): string | null {
        return this.getInput().getAttribute('aria-labelledby');
    }

    public async typeText(text: string): Promise<void> {
        const input = this.getInput();
        input.value = text;
        input.dispatchEvent(
            new Event('input', { bubbles: true, composed: true })
        );
        await waitForUpdatesAsync();
    }

    public async commitText(text: string): Promise<void> {
        const input = this.getInput();
        input.value = text;
        input.dispatchEvent(
            new Event('change', { bubbles: true })
        );
        await waitForUpdatesAsync();
    }

    public async clickClearButton(): Promise<void> {
        const button = this.getClearButton();
        if (!button) {
            throw new Error(
                'Clear button not found — is the search input value non-empty?'
            );
        }
        button.click();
        await waitForUpdatesAsync();
    }

    public isClearButtonVisible(): boolean {
        return !!this.searchInputElement.shadowRoot?.querySelector(
            '.search-input-clear'
        );
    }

    public isInputDisabled(): boolean {
        return this.getInput().disabled;
    }

    public isInputReadOnly(): boolean {
        return this.getInput().readOnly;
    }

    public isInputAutofocus(): boolean {
        return this.getInput().autofocus;
    }

    private getInput(): HTMLInputElement {
        const input = this.searchInputElement.shadowRoot?.querySelector<HTMLInputElement>(
            '.search-input'
        );
        if (!input) {
            throw new Error('Search input element not found');
        }
        return input;
    }

    private getClearButton(): HTMLButtonElement | null {
        return this.searchInputElement.shadowRoot?.querySelector<HTMLButtonElement>(
            '.search-input-clear'
        ) ?? null;
    }
}
