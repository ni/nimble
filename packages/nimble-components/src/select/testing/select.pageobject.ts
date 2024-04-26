import {
    keyEnter,
    keyEscape,
    keyArrowDown,
    keyArrowUp,
    keySpace,
    keyTab
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
        this.clickSelect();
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

    public getActiveOption(): ListOption | null {
        return (
            (this.selectElement.options.find(
                o => (o as ListOption).activeOption === true
            ) as ListOption) ?? null
        );
    }

    public getDisplayText(): string {
        const displayText = this.selectElement.shadowRoot?.querySelector('.selected-value')
            ?.textContent ?? '';
        return displayText.trim();
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public clickSelect(): void {
        this.selectElement.click();
    }

    public clickSelectedItem(): void {
        if (!this.selectElement.open) {
            throw new Error('Select must be open to click selectedItem');
        }

        const selectedOption = this.getActiveOption();
        if (!selectedOption) {
            throw new Error('No option is selected to click');
        }
        this.clickOption(this.selectElement.options.indexOf(selectedOption));
    }

    public async clickFilterInput(): Promise<void> {
        if (!this.selectElement.filterInput) {
            throw new Error('Filter input is not available.');
        }
        this.selectElement.filterInput.click();
        await waitForUpdatesAsync();
    }

    public clickOption(index: number): void {
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
     * Click the option with the text provided by the 'displayText' parameter.
     * @param value The text of the option to be selected
     */
    public clickOptionWithDisplayText(displayText: string): void {
        if (!this.selectElement.open) {
            this.clickSelect();
        }
        const optionIndex = this.selectElement.options.findIndex(
            o => o.text === displayText
        );
        if (optionIndex === -1) {
            throw new Error(`No option with "text" of ${displayText}`);
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

    public pressTabKey(): void {
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyTab })
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

    public pressCharacterKey(character: string): void {
        if (character.length !== 1) {
            throw new Error(
                'character parameter must contain only a single character'
            );
        }

        if (
            this.selectElement.open
            && this.selectElement.filterMode !== FilterMode.none
        ) {
            const filterInput = this.selectElement.filterInput!;
            filterInput.value = filterInput.value + character;
        }
        const inputElement = this.selectElement.open
            && this.selectElement.filterMode !== FilterMode.none
            ? this.selectElement.filterInput
            : this.selectElement;
        inputElement!.dispatchEvent(new InputEvent('input'));
        this.selectElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: character })
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
        return this.selectElement.filterInput?.value ?? '';
    }

    private getFilterInput(): HTMLInputElement | null | undefined {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Select has filterMode of "none" so there is no filter input'
            );
        }
        return this.selectElement.filterInput;
    }
}
