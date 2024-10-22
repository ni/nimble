import { html } from '@microsoft/fast-element';
import { Tabs, tabsTag } from '..';
import { fixture, Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { TabsPageObject } from '../testing/tabs.pageobject';

async function setup(): Promise<Fixture<Tabs>> {
    const viewTemplate = html`
        <nimble-tabs>
            <nimble-tab id="1">Tab 1</nimble-tab>
            <nimble-tab id="2">Tab 2</nimble-tab>
            <nimble-tab id="3">Tab 3</nimble-tab>
            <nimble-tab id="4">Tab 4</nimble-tab>
            <nimble-tab id="5">Tab 5</nimble-tab>
            <nimble-tab id="6">Tab 6</nimble-tab>
            <nimble-tab-panel>Panel 1</nimble-tab-panel>
            <nimble-tab-panel>Panel 2</nimble-tab-panel>
            <nimble-tab-panel>Panel 3</nimble-tab-panel>
            <nimble-tab-panel>Panel 4</nimble-tab-panel>
            <nimble-tab-panel>Panel 5</nimble-tab-panel>
            <nimble-tab-panel>Panel 6</nimble-tab-panel>
        </nimble-tabs>
    `;

    return await fixture<Tabs>(viewTemplate);
}

describe('Tabs', () => {
    it('should export its tag', () => {
        expect(tabsTag).toBe('nimble-tabs');
    });

    it('can construct an element instance', () => {
        expect(document.createElement('nimble-tabs')).toBeInstanceOf(Tabs);
    });

    it('setting activeid should scroll the active tab into view', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const tabsPageObject = new TabsPageObject(element);
        await tabsPageObject.setTabsWidth(300);
        element.activeid = '6'; // scrolls to the last tab
        await waitForUpdatesAsync();
        expect(tabsPageObject.getTabsViewScrollOffset()).toBeGreaterThan(0);

        await disconnect();
    });

    it('clicking on a tab that is completely in view should not scroll the tablist', async () => {
        const { element, connect, disconnect } = await setup();
        await connect();
        const tabsPageObject = new TabsPageObject(element);
        await tabsPageObject.setTabsWidth(300);
        await tabsPageObject.clickTab(2); // clicks the third tab
        await waitForUpdatesAsync();
        expect(tabsPageObject.getTabsViewScrollOffset()).toBe(0);

        await disconnect();
    });

    describe('Scroll buttons', () => {
        let tabsPageObject: TabsPageObject;
        let element: Tabs;
        let connect: () => Promise<void>;
        let disconnect: () => Promise<void>;

        beforeEach(async () => {
            ({ element, connect, disconnect } = await setup());
            await connect();
            tabsPageObject = new TabsPageObject(element);
        });

        afterEach(async () => {
            await disconnect();
        });

        it('should not show scroll buttons when the tabs fit within the container', () => {
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when the tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(300);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when the tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(300); // first make the tabs overflow
            await tabsPageObject.setTabsWidth(1000); // then make the tabs fit
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should scroll left when the left scroll button is clicked', async () => {
            await tabsPageObject.setTabsWidth(300);
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeLessThan(
                currentScrollOffset
            );
        });

        it('should not scroll left when the left scroll button is clicked and the first tab is active', async () => {
            await tabsPageObject.setTabsWidth(300);
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(0);
        });

        it('should scroll right when the right scroll button is clicked', async () => {
            await tabsPageObject.setTabsWidth(300);
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeGreaterThan(0);
        });

        it('should not scroll right when the right scroll button is clicked and the last tab is active', async () => {
            await tabsPageObject.setTabsWidth(300);
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(
                currentScrollOffset
            );
        });

        it('should show scroll buttons when new tab is added and tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(450);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab is removed and tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(500);
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.removeTab(6);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });

        it('should show scroll buttons when tab label is updated and tabs overflow the container', async () => {
            await tabsPageObject.setTabsWidth(450);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.updateTabLabel(
                0,
                'New Tab With Extremely Long Name'
            );
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
        });

        it('should hide scroll buttons when tab label is updated and tabs no longer overflow the container', async () => {
            await tabsPageObject.setTabsWidth(550);
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.updateTabLabel(6, 'Tab 6');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
        });
    });
});
