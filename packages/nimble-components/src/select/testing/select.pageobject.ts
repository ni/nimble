import type { Select } from '..';
import type { ListOption } from '../../list-option';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';
import { checkFullyInViewport } from '../../utilities/tests/intersection-observer';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class SelectPageObject {
    public constructor(private readonly select: Select) {}

    /**
     * Sets the selected value programmatically
     * @param value The value of the nimble-list-option to select
     */
    public async setValue(value: string): Promise<void> {
        this.select.value = value;
        await waitForUpdatesAsync();
    }

    /**
     * Sets the selected value interactively
     * @param value The value of the nimble-list-option to select
     */
    public async selectValue(value: string): Promise<void> {
        const option = this.getOptionWithValue(value);
        if (!option) {
            throw new Error(`No option found with value ${value}`);
        }
        await this.clickAndWaitForOpen();
        option.click();
        await waitForUpdatesAsync();
    }

    /**
     * Clicks the select to open the drop down
     */
    public async clickAndWaitForOpen(): Promise<void> {
        const regionLoadedListener = createEventListener(this.select, 'loaded');
        this.select.click();
        await regionLoadedListener.promise;
    }

    /** Checks if the dropdown is fully visible */
    public async isDropdownFullyInViewport(): Promise<boolean> {
        return checkFullyInViewport(this.select.listbox);
    }

    /**
     * Gets the child list option element with the given value
     * @param value The value to search for
     * @returns The list option element if found and undefined if not
     */
    public getOptionWithValue(value: string): ListOption | undefined {
        return this.select.options.find(o => o.value === value);
    }

    /**
     * Gets the value of every child list option
     * @returns A string array containing each option's value
     */
    public getOptionValues(): string[] {
        return this.select.options.map(o => o.value);
    }

    /**
     * Gets the display value of every child list option
     * @returns A string array containing each option's display value
     */
    public getOptionDisplayValues(): string[] {
        return this.select.options.map(o => o.text.trim());
    }

    /**
     * Gets the number of child list options
     * @returns The number of options
     */
    public getOptionCount(): number {
        return this.select.options.length;
    }
}
