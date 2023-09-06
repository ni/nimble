import { Select } from '..';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { createEventListener } from '../../utilities/tests/component';

/**
 * Page object for the `nimble-select` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class SelectPageObject {
    public constructor(private readonly select: Select) {}

    public async setValue(value: string): Promise<void> {
        this.select.value = value;
        await waitForUpdatesAsync();
    }

    public async clickAndWaitForOpen(): Promise<void> {
        const regionLoadedListener = createEventListener(this.select, 'loaded');
        this.select.click();
        await regionLoadedListener.promise;
    }
}
