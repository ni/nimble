import { TablePageObject as NimbleComponentsTablePageObject } from '@ni/nimble-components/dist/esm/table/testing/table.pageobject';
import { waitForUpdatesAsync } from '@ni/nimble-angular';
import type { Table, TableRecord } from '@ni/nimble-angular/table';

/**
 * The page object for the `nimble-table` component to provide consistent ways of querying
 * and interacting with the component during tests.
 *
 * This Angular version of the page object extends the nimble-components version to add the ability
 * to wait for data updates to be applied to the table since the timing isn't easily observable
 * when using the `data$` property.
 */
export class TablePageObject<T extends TableRecord> extends NimbleComponentsTablePageObject<T> {
    private mostRecentSetDataPromise?: Promise<void>;

    public constructor(tableElement: Table<T>) {
        super(tableElement);

        // Cache the most recent promise returned from calls to setData() on the nimble table
        // so that we can appropriately wait for them to complete to know when the Angular
        // data$ Observable has been applied to the table.
        const originalSetDataFn = tableElement.setData.bind(tableElement);
        tableElement.setData = async (...args): Promise<void> => {
            this.mostRecentSetDataPromise = originalSetDataFn(...args);
            return this.mostRecentSetDataPromise;
        };
    }

    public async waitForDataUpdatesToRender(): Promise<void> {
        if (this.mostRecentSetDataPromise) {
            await this.mostRecentSetDataPromise;
        }
        // If the table is styled with the `fit-rows-height` token, wait for the height to be calculated
        await waitForUpdatesAsync();
        // Wait for the rows to be rendered
        await waitForUpdatesAsync();
    }
}
