import type { Tabs } from '..';
import { TabsBasePageObject } from '../../patterns/tabs/testing/tabs-base.pageobject';
import { tabTag } from '../../tab';
import { tabPanelTag } from '../../tab-panel';

/**
 * Page object for the `nimble-tabs` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TabsPageObject extends TabsBasePageObject<Tabs> {
    public constructor(tabsElement: Tabs) {
        super(tabsElement, tabTag, tabPanelTag);
    }
}
