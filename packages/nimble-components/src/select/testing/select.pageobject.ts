import {
    keyEnter,
    keyEscape,
    keyArrowDown,
    keyArrowUp,
    keySpace,
    keyTab
} from '@ni/fast-web-utilities';
import type { Select } from '..';
import { listOptionTag, type ListOption } from '../../list-option';
import {
    processUpdates,
    waitForUpdatesAsync
} from '../../testing/async-helpers';
import { FilterMode } from '../types';
import type { Button } from '../../button';
import type { ListOptionGroup } from '../../list-option-group';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class SelectPageObject {
    public constructor(protected readonly selectElement: Select) {}

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
                o => (o as ListOption).activeOption
            ) as ListOption) ?? null
        );
    }

    public getDisplayText(): string {
        const displayText = this.selectElement.shadowRoot?.querySelector('.selected-value')
            ?.textContent ?? '';
        return displayText.trim();
    }

    public getGroupLabels(): string[] {
        return Array.from(
            this.selectElement.querySelectorAll<ListOptionGroup>(
                '[role="group"]'
            ) ?? []
        ).map(group => group.labelContent);
    }

    public getGroupOptionLabelsByIndex(groupIndex: number): string[] {
        const group = Array.from(
            this.selectElement.querySelectorAll<ListOptionGroup>(
                '[role="group"]'
            ) ?? []
        )[groupIndex];
        return Array.from(
            group?.querySelectorAll<ListOption>('[role="option"]') ?? []
        ).map(option => option.textContent?.trim() ?? '');
    }

    public getGroupOptionLabelsByLabel(groupLabel: string): string[] {
        const group = Array.from(
            this.selectElement.querySelectorAll<ListOptionGroup>(
                '[role="group"]'
            ) ?? []
        ).find(g => g.labelContent === groupLabel);
        return Array.from(
            group?.querySelectorAll<ListOption>('[role="option"]') ?? []
        ).map(option => option.textContent?.trim() ?? '');
    }

    /**
     * Gets the label text of the element
     * @returns The current slotted label text, if any
     */
    public getLabelText(): string {
        return this.selectElement.labelContent;
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public clickSelect(): void {
        this.selectElement.click();
    }

    public clickActiveItem(): void {
        if (!this.selectElement.open) {
            throw new Error('Select must be open to click selectedItem');
        }

        const selectedOption = this.getActiveOption();
        if (!selectedOption) {
            throw new Error('No option is selected to click');
        }
        const visibleOptions = this.getVisibleOptions();
        this.clickOption(visibleOptions.indexOf(selectedOption));
    }

    public async clickFilterInput(): Promise<void> {
        if (!this.selectElement.filterInput) {
            throw new Error('Filter input is not available.');
        }
        this.selectElement.filterInput.click();
        await waitForUpdatesAsync();
    }

    /**
     * Selects an option using an index value into the list of visible options.
     * Options that have the `hidden` or `visuallyHidden` attribute set to true
     * are not considered visible.
     * @param index The index of the option in the visible set to be selected
     * @remarks Prefer clickOptionWithDisplayText where possible. This method is
     * useful when the display text is not unique and the index is known.
     */
    public clickOption(index: number): void {
        const visibleOptions = this.getVisibleOptions();
        if (index >= visibleOptions.length) {
            throw new Error(
                '"index" greater than number of current displayed options'
            );
        }

        const option = visibleOptions[index]!;
        option.scrollIntoView();
        option.click();
    }

    /**
     * Click the option with the text provided by the 'displayText' parameter.
     * @param value The text of the option to be selected
     * @remarks This method is useful when the display text is unique. If the
     * display text is not unique, the first option with the matching text will
     * be selected.
     */
    public clickOptionWithDisplayText(displayText: string): void {
        if (!this.selectElement.open) {
            this.clickSelect();
        }
        const optionIndex = this.getVisibleOptions().findIndex(
            o => o.text === displayText
        );
        if (optionIndex === -1) {
            throw new Error(`No option with "text" of ${displayText}`);
        }

        this.clickOption(optionIndex);
    }

    public clickClearButton(): void {
        if (!this.selectElement.clearable) {
            throw new Error(
                'Select must set "clearable" in order to click clear button'
            );
        }

        if (
            this.selectElement.selectedIndex === -1
            || this.selectElement.displayPlaceholder
        ) {
            throw new Error(
                'Select must have a selected element in order to click clear button'
            );
        }

        const clearButton = this.getClearButton();
        clearButton?.click();
        processUpdates();
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
        this.selectElement.dispatchEvent(new FocusEvent('focusout'));
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
            filterInput.value += character;
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

    /**
     * This method will set the filter input value to the provided text, which
     * will result in the synchronous dispatch of the 'filter-input' event. The
     * dropdown must be open for this method to work.
     * @param filterText
     */
    public setFilter(filterText: string): void {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Select has filterMode of "none" so there is no filter input'
            );
        }

        if (!this.selectElement.open) {
            throw new Error('Select must be open to set filter text');
        }

        const filterInput = this.getFilterInput();
        filterInput!.value = filterText;
        const inputEvent = new InputEvent('input');
        filterInput?.dispatchEvent(inputEvent);
    }

    /**
     * This method will clear any present filter text, which will result in the
     * synchronous dispatch of the 'filter-input' event. The dropdown must be
     * open for this method to work.
     */
    public clearFilter(): void {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Select has filterMode of "none" so there is no filter input'
            );
        }
        const filterInput = this.getFilterInput();
        filterInput!.value = '';
        filterInput?.dispatchEvent(
            new InputEvent('input', { inputType: 'deleteContentBackward' })
        );
    }

    public isDropdownVisible(): boolean {
        return (
            this.selectElement.shadowRoot?.querySelector('.listbox') !== null
        );
    }

    public isClearButtonVisible(): boolean {
        return this.getClearButton() != null;
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

    public isLoadingVisualVisible(): boolean {
        return (
            this.selectElement.shadowRoot?.querySelector(
                '.loading-container'
            ) !== null
        );
    }

    public getFilterInputText(): string {
        return this.selectElement.filterInput?.value ?? '';
    }

    private getVisibleOptions(): ListOption[] {
        const options = Array.from(
            this.selectElement.querySelectorAll(listOptionTag)
        );
        return options.filter(o => !(o.hidden || o.visuallyHidden));
    }

    private getFilterInput(): HTMLInputElement | null | undefined {
        if (this.selectElement.filterMode === FilterMode.none) {
            throw new Error(
                'Select has filterMode of "none" so there is no filter input'
            );
        }
        return this.selectElement.filterInput;
    }

    private getClearButton(): Button | null | undefined {
        return this.selectElement.shadowRoot?.querySelector<Button>(
            '.clear-button'
        );
    }
}
