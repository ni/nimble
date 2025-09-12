import {
    keyEnter,
    keySpace,
    keyArrowDown,
    keyArrowUp
} from '@ni/fast-web-utilities';
import type { Multiselect } from '..';
import { ListOption } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

/**
 * Page object for interacting with a {@link Multiselect} in tests.
 */
export class MultiselectPageObject {
    public constructor(protected readonly element: Multiselect) {}

    /** Returns the control element that holds the selected value and buttons. */
    public get control(): HTMLElement | null {
        return this.element.querySelector('.control');
    }

    /** Returns the displayed selected value element. */
    public get selectedValue(): HTMLElement | null {
        return this.element.querySelector('.selected-value');
    }

    /** Returns the currently selected options. */
    public getSelectedOptions(): ListOption[] {
        return this.element.selectedOptions as ListOption[];
    }

    /** Returns the active option. */
    public getActiveOption(): ListOption | null {
        return (
            (this.element.options.find(
                o => (o as ListOption).activeOption
            ) as ListOption) ?? null
        );
    }

    /** Clicks the multiselect to open/close it. */
    public clickMultiselect(): void {
        this.element.click();
    }

    /** Clicks an option by index. */
    public clickOption(index: number): void {
        const option = this.element.options[index] as ListOption;
        if (option) {
            option.click();
        }
    }

    /** Presses the Enter key on the multiselect. */
    public pressEnterKey(): void {
        this.element.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyEnter })
        );
    }

    /** Presses the Space key on the multiselect. */
    public async pressSpaceKey(): Promise<void> {
        this.element.dispatchEvent(
            new KeyboardEvent('keydown', { key: keySpace, bubbles: true })
        );
        await waitForUpdatesAsync();
    }

    /** Presses the Arrow Down key on the multiselect. */
    public pressArrowDownKey(): void {
        this.element.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowDown })
        );
    }

    /** Presses the Arrow Up key on the multiselect. */
    public pressArrowUpKey(): void {
        this.element.dispatchEvent(
            new KeyboardEvent('keydown', { key: keyArrowUp })
        );
    }

    /** Gets the display text of the multiselect. */
    public getDisplayText(): string {
        const displayText = this.element.shadowRoot?.querySelector('.selected-value')
            ?.textContent ?? '';
        return displayText.trim();
    }
}
