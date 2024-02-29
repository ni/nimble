import {
    keyEnter,
    keyEscape,
    keyArrowDown,
    keyArrowUp,
    keySpace
} from '@microsoft/fast-web-utilities';
import type { Select } from '..';
import type { ListOption } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { FilterMode } from '../types';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class SelectPageObject {
    public constructor(private readonly selectElement: Select) {}

    public async openAndSetFilterText(filterText: string): Promise<void> {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Can not set filter text with filterMode set to "none".'
            );
        }
        await this.clickSelect();
        const filterInput = this.getFilterInput();
        if (filterInput) {
            filterInput.value = filterText;
        }

        await waitForUpdatesAsync();
        const inputEvent = new InputEvent('input');
        filterInput?.dispatchEvent(inputEvent);
        await waitForUpdatesAsync();
    }

    public async closeDropdown(): Promise<void> {
        this.selectElement.open = false;
        await waitForUpdatesAsync();
    }

    public async setOptions(options: ListOption[]): Promise<void> {
        options.forEach(option => {
            option.setAttribute('role', 'option');
        });
        this.selectElement.slottedOptions = options;
        await waitForUpdatesAsync();
    }

    public getFilteredOptions(): ListOption[] {
        return this.selectElement.filteredOptions as ListOption[];
    }

    public getSelectedOption(): ListOption | null {
        return (this.selectElement.selectedOptions[0] as ListOption) ?? null;
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public async clickSelect(): Promise<void> {
        this.selectElement.click();
        await waitForUpdatesAsync();
    }

    public clickSelectedItem(): void {
        if (!this.selectElement.open) {
            throw new Error('Select must be open to click selectedItem');
        }

        this.clickOption(this.selectElement.selectedIndex);
    }

    public async clickFilterInput(): Promise<void> {
        if (!this.selectElement.filterInput) {
            throw new Error('Filter input is not available.');
        }
        this.selectElement.filterInput.click();
        await waitForUpdatesAsync();
    }

    public clickOption(index: number): void {
        if (!this.selectElement.open) {
            throw new Error('Select must be open to click selectedItem');
        }

        if (index >= this.selectElement.options.length) {
            throw new Error(
                '"index" greater than number of current displayed options'
            );
        }

        const option = this.selectElement.options[index]!;
        option.scrollIntoView();
        option.click();
    }

    /**
     * Click the option with the text provided by the 'value' parameter.
     * @param value The text of the option to be selected
     */
    public clickOptionWithDisplayText(value: string): void {
        const optionIndex = this.selectElement.options.findIndex(
            o => o.text === value
        );
        if (optionIndex === -1) {
            throw new Error(`No option with "text" of ${value}`);
        }

        this.clickOption(optionIndex);
    }

    public async clickAway(): Promise<void> {
        this.selectElement.dispatchEvent(new Event('focusout'));
        await waitForUpdatesAsync();
    }

    public pressEnterKey(): void {
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    public pressEscapeKey(): void {
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEscape })
        );
    }

    public pressArrowDownKey(): void {
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowDown })
        );
    }

    public pressArrowUpKey(): void {
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowUp })
        );
    }

    public async pressSpaceKey(): Promise<void> {
        const alreadyOpen = this.selectElement.open;
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keySpace, bubbles: true })
        );
        await waitForUpdatesAsync();
        if (
            this.selectElement.filterMode === FilterMode.standard
            && alreadyOpen
        ) {
            // add space to end of current filter
            const filterValue = `${
                this.selectElement.filterInput?.value ?? ''
            } `;
            if (this.selectElement.filterInput) {
                this.selectElement.filterInput.value = filterValue;
            }
            this.selectElement.filterInput?.dispatchEvent(
                new InputEvent('input', { inputType: 'insertText' })
            );
        }
        await waitForUpdatesAsync();
    }

    public isDropdownVisible(): boolean {
        return (
            this.selectElement.shadowRoot?.querySelector('.listbox') !== null
        );
    }

    public isFilterInputVisible(): boolean {
        return (
            this.selectElement.shadowRoot?.querySelector('.filter-field')
            !== null
        );
    }

    public isOptionVisible(index: number): boolean {
        if (index >= this.selectElement.options.length) {
            throw new Error('Indexing past number of options');
        }
        const option = this.selectElement.options[index]!;
        const optionRects = option.getClientRects();
        return optionRects.length > 0 && optionRects[0]!.height !== 0;
    }

    public isNoResultsLabelVisible(): boolean {
        return (
            this.selectElement.shadowRoot?.querySelector(
                '.no-results-label'
            ) !== null
        );
    }

    public getFilterInputText(): string {
        return this.getFilterInput()?.value ?? '';
    }

    private getFilterInput(): HTMLInputElement | null | undefined {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Select has filterMode of "none" so there is no filter input'
            );
        }
        return this.selectElement.shadowRoot?.querySelector<HTMLInputElement>(
            '.filter-input'
        );
    }
}
