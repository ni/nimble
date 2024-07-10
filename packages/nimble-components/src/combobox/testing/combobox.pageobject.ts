import { keyEnter, keyArrowDown } from '@microsoft/fast-web-utilities';
import type { Combobox } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import {
    createEventListener,
    waitAnimationFrame
} from '../../utilities/tests/component';

/**
 * Page object for the `nimble-combobox` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class ComboboxPageObject {
    private readonly regionLoadedListener = createEventListener(
        this.comboboxElement,
        'loaded'
    );

    public constructor(protected readonly comboboxElement: Combobox) {}

    public async waitForAnchoredRegionLoaded(): Promise<void> {
        await this.regionLoadedListener.promise;
    }

    // The Selection API currently isn't supported properly or consistently in shadow DOM,
    // so unfortunately our delete API has to be passed the post-deletion text.
    public setInputText(text: string, asDelete = false): void {
        this.comboboxElement.control.value = text;
        const inputEvent = new InputEvent('input', {
            data: text,
            inputType: asDelete ? 'deleteContent' : 'insertText'
        });
        this.comboboxElement.control.dispatchEvent(inputEvent);
    }

    public commitValue(text: string): void {
        this.setInputText(text);
        this.pressEnterKey();
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public clickCombobox(): void {
        this.comboboxElement.click();
    }

    public async clickAndWaitForOpen(): Promise<void> {
        this.clickCombobox();
        await this.regionLoadedListener.promise;
        await waitForUpdatesAsync();
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public clickDropdownButton(): void {
        this.comboboxElement.dropdownButton!.control.click();
    }

    public async clickDropdownButtonAndWaitForOpen(): Promise<void> {
        this.clickDropdownButton();
        await this.regionLoadedListener.promise;
        await waitAnimationFrame(); // necessary because scrolling is queued with requestAnimationFrame
    }

    public isDropdownButtonChecked(): boolean {
        return this.comboboxElement.dropdownButton!.checked;
    }

    public isDropdownButtonDisabled(): boolean {
        return this.comboboxElement.dropdownButton!.disabled;
    }

    /**
     * Either opens or closes the dropdown depending on its current state
     */
    public clickInput(): void {
        this.comboboxElement.control.click();
    }

    public getInputTitle(): string | null {
        return this.comboboxElement.control.getAttribute('title');
    }

    public getInputAriaLabel(): string | null {
        return this.comboboxElement.control.getAttribute('aria-label');
    }

    public async mouseoverInput(): Promise<void> {
        this.comboboxElement.control.dispatchEvent(new MouseEvent('mouseover'));
        await waitForUpdatesAsync();
    }

    public async mouseoutInput(): Promise<void> {
        this.comboboxElement.control.dispatchEvent(new MouseEvent('mouseout'));
        await waitForUpdatesAsync();
    }

    public async prependOption(value: string, label: string): Promise<void> {
        this.comboboxElement.insertAdjacentHTML(
            'afterbegin',
            `<nimble-list-option value="${value}">${label}</nimble-list-option>`
        );
        await waitForUpdatesAsync();
    }

    public async clickAway(): Promise<void> {
        this.comboboxElement.dispatchEvent(new Event('focusout'));
        await waitForUpdatesAsync();
    }

    public pressEnterKey(): void {
        this.comboboxElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    public pressArrowDownKey(): void {
        this.comboboxElement.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowDown })
        );
    }
}
