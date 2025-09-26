import { html } from '@ni/fast-element';
import { Tabs, tabsTag } from '..';
import { fixture, type Fixture } from '../../utilities/tests/fixture';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { TabsPageObject } from '../testing/tabs.pageobject';
import { tabTag } from '../../tab';

async function setup(): Promise<Fixture<Tabs>> {
    const viewTemplate = html`
        <${tabsTag}>
            <${tabTag} id="1">Tab 1</${tabTag}>
            <${tabTag} id="2">Tab 2</${tabTag}>
            <${tabTag} id="3">Tab 3</${tabTag}>
            <${tabTag} id="4">Tab 4</${tabTag}>
            <${tabTag} id="5">Tab 5</${tabTag}>
            <${tabTag} id="6">Tab 6</${tabTag}>
            <${tabTag}-panel>Panel 1</${tabTag}-panel>
            <${tabTag}-panel>Panel 2</${tabTag}-panel>
            <${tabTag}-panel>Panel 3</${tabTag}-panel>
            <${tabTag}-panel>Panel 4</${tabTag}-panel>
            <${tabTag}-panel>Panel 5</${tabTag}-panel>
            <${tabTag}-panel>Panel 6</${tabTag}-panel>
        </${tabsTag}>
    `;

    return await fixture<Tabs>(viewTemplate);
}

async function setupInstance(): Promise<
Fixture<Tabs> & { tabsPageObject: TabsPageObject }
> {
    const fixtureResult = await setup();
    await fixtureResult.connect();
    const tabsPageObject = new TabsPageObject(fixtureResult.element);
    return {
        ...fixtureResult,
        tabsPageObject
    };
}

describe('Tabs', () => {
    it('can construct an element instance', () => {
        expect(document.createElement(tabsTag)).toBeInstanceOf(Tabs);
    });

    it('setting activeid should scroll the active tab into view', async () => {
        const { element, tabsPageObject, disconnect } = await setupInstance();
        await tabsPageObject.setTabsWidth(300);
        element.activeid = '6'; // scrolls to the last tab
        await waitForUpdatesAsync();
        expect(tabsPageObject.getTabsViewScrollOffset()).toBeGreaterThan(0);

        await disconnect();
    });

    it('clicking on a tab that is completely in view should not scroll the tablist', async () => {
        const { tabsPageObject, disconnect } = await setupInstance();
        await tabsPageObject.setTabsWidth(300);
        await tabsPageObject.clickTab(2); // clicks the third tab
        await waitForUpdatesAsync();
        expect(tabsPageObject.getTabsViewScrollOffset()).toBe(0);

        await disconnect();
    });

    describe('Scroll buttons', () => {
        it('should not show scroll buttons when the tabs fit within the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await disconnect();
        });

        it('should show scroll buttons when the tabs overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await disconnect();
        });

        it('should hide scroll buttons when the tabs no longer overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300); // first make the tabs overflow
            await tabsPageObject.setTabsWidth(1000); // then make the tabs fit
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await disconnect();
        });

        it('should scroll left when the left scroll button is clicked', async () => {
            const { element, tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300);
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeLessThan(
                currentScrollOffset
            );
            await disconnect();
        });

        it('should not scroll left when the left scroll button is clicked and the first tab is active', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300);
            await tabsPageObject.clickScrollLeftButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(0);
            await disconnect();
        });

        it('should scroll right when the right scroll button is clicked', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300);
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBeGreaterThan(0);
            await disconnect();
        });

        it('should not scroll right when the right scroll button is clicked and the last tab is active', async () => {
            const { element, tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(300);
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollOffset = tabsPageObject.getTabsViewScrollOffset();
            await tabsPageObject.clickScrollRightButton();
            expect(tabsPageObject.getTabsViewScrollOffset()).toBe(
                currentScrollOffset
            );
            await disconnect();
        });

        it('should show scroll buttons when new tab is added and tabs overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(450);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await disconnect();
        });

        it('should hide scroll buttons when tab is removed and tabs no longer overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(500);
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.removeTab(6);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await disconnect();
        });

        it('should show scroll buttons when tab label is updated and tabs overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(450);
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await tabsPageObject.updateTabLabel(
                0,
                'New Tab With Extremely Long Name'
            );
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await disconnect();
        });

        it('should hide scroll buttons when tab label is updated and tabs no longer overflow the container', async () => {
            const { tabsPageObject, disconnect } = await setupInstance();
            await tabsPageObject.setTabsWidth(550);
            await tabsPageObject.addTab('New Tab With Extremely Long Name');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeTrue();
            await tabsPageObject.updateTabLabel(6, 'Tab 6');
            expect(tabsPageObject.areScrollButtonsVisible()).toBeFalse();
            await disconnect();
        });
    });
});
