import { keyEnter, keyArrowDown, keyArrowUp } from '@ni/fast-web-utilities';
import type { Combobox } from '..';
import { listOptionTag } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import {
    waitAnimationFrame,
    waitPredicate
} from '../../utilities/testing/component';
import { slotTextContent } from '../../utilities/models/slot-text-content';

/**
 * Page object for the `nimble-combobox` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ComboboxPageObject {
    public constructor(protected readonly comboboxElement: Combobox) {}

    /**
     * Gets the selectable options in the drop-down. Does not include options that are disabled or filtered out.
     */
    public getFilteredOptions(): string[] {
        return this.comboboxElement.filteredOptions.map(x => x.text);
    }

    /**
     * Sets the input text and commits the value by pressing Enter. Will emit a 'change' event.
     */
    public async commitValue(text: string): Promise<void> {
        await this.waitForListboxPositioned();
        this.setInputText(text);
        this.pressEnterKey();
    }

    /**
     * Gets the label text of the element
     * @returns The current slotted label text, if any
     */
    public getLabelText(): string {
        const labelSlot = this.comboboxElement.shadowRoot!.querySelector<HTMLSlotElement>(
            'label > slot'
        )!;
        return slotTextContent(labelSlot);
    }

    /**
     * @internal
     *
     * The Selection API currently isn't supported properly or consistently in shadow DOM,
     * so unfortunately our delete API has to be passed the post-deletion text.
     */
    public setInputText(text: string, asDelete = false): void {
        this.comboboxElement.control.value = text;
        const inputEvent = new InputEvent('input', {
            data: text,
            inputType: asDelete ? 'deleteContentForward' : 'insertText'
        });
        this.comboboxElement.control.dispatchEvent(inputEvent);
    }

    /**
     * @internal
     *
     * Either opens or closes the dropdown depending on its current state
     */
    public clickCombobox(): void {
        this.comboboxElement.click();
    }

    /**
     * @internal
     */
    public async clickAndWaitForOpen(): Promise<void> {
        this.clickCombobox();
        await this.waitForListboxPositioned();
        await waitForUpdatesAsync();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    /**
     * @internal
     *
     * Either opens or closes the dropdown depending on its current state
     */
    public clickDropdownButton(): void {
        this.comboboxElement.dropdownButton!.control.click();
    }

    /**
     * @internal
     */
    public async clickDropdownButtonAndWaitForOpen(): Promise<void> {
        this.clickDropdownButton();
        await this.waitForListboxPositioned();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    /**
     * @internal
     */
    public isDropdownButtonChecked(): boolean {
        return this.comboboxElement.dropdownButton!.checked;
    }

    /**
     * @internal
     */
    public isDropdownButtonDisabled(): boolean {
        return this.comboboxElement.dropdownButton!.disabled;
    }

    /**
     * @internal
     *
     * Either opens or closes the dropdown depending on its current state
     */
    public clickInput(): void {
        this.comboboxElement.control.click();
    }

    /**
     * @internal
     */
    public getInputTitle(): string | null {
        return this.comboboxElement.control.getAttribute('title');
    }

    /**
     * @internal
     */
    public getInputAriaLabel(): string | null {
        return this.comboboxElement.control.getAttribute('aria-label');
    }

    /**
     * @internal
     */
    public async mouseoverInput(): Promise<void> {
        this.comboboxElement.control.dispatchEvent(new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
    }

    /**
     * @internal
     */
    public async mouseoutInput(): Promise<void> {
        this.comboboxElement.control.dispatchEvent(new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
    }

    /**
     * @internal
     */
    public async prependOption(value: string, label: string): Promise<void> {
        this.comboboxElement.insertAdjacentHTML(
            'afterbegin',
            `<${listOptionTag} value="${value}">${label}</${listOptionTag}>`
        );
        await waitForUpdatesAsync();
    }

    /**
     * @internal
     */
    public async clickAway(): Promise<void> {
        this.comboboxElement.dispatchEvent(new Event('focusout'));
        await waitForUpdatesAsync();
    }

    /**
     * @internal
     */
    public pressEnterKey(): void {
        this.comboboxElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    /**
     * @internal
     */
    public pressArrowDownKey(): void {
        this.comboboxElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowDown })
        );
    }

    /**
     * @internal
     */
    public pressArrowUpKey(): void {
        this.comboboxElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowUp })
        );
    }

    /**
     * @internal
     */
    public hideAllOptions(): void {
        this.comboboxElement.options.forEach(o => {
            o.hidden = true;
        });
        this.comboboxElement.filterOptions();
    }

    /**
     * @internal
     */
    public isNoResultsLabelVisible(): boolean {
        return (
            this.comboboxElement.shadowRoot?.querySelector(
                '.no-results-label'
            ) !== null
        );
    }

    /**
     * @internal
     */
    public async waitForListboxPositioned(): Promise<void> {
        await waitPredicate(
            () => this.comboboxElement.region?.classList.contains(
                'horizontal-center'
            ) === true
        );
    }
}
