import type { AnchorTabs } from '..';
import { TabsBasePageObject } from '../../patterns/tabs/testing/tabs-base.pageobject';

/**
 * Page object for the `nimble-anchor-tabs` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class AnchorTabsPageObject extends TabsBasePageObject<AnchorTabs> {
    public constructor(tabsElement: AnchorTabs) {
        super(tabsElement, 'nimble-anchor-tab');
    }
}
