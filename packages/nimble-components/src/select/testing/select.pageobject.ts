import { Select } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class SelectPageObject {
    public constructor(private readonly element: Select) {}

    public async setValue(value: string): Promise<void> {
        this.element.value = value;
        await waitForUpdatesAsync();
    }
}
