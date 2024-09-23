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

    return fixture<Tabs>(viewTemplate);
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
        await waitForUpdatesAsync(); // wait for the resize observer to fire
        element.activeid = '6'; // scrolls to the last tab
        await waitForUpdatesAsync();
        expect(
            element.shadowRoot!.querySelector('.tablist')!.scrollLeft
        ).toBeGreaterThan(0);

        await disconnect();
    });

    describe('Scroll buttons', () => {
        it('should not show scroll buttons when the tabs fit within the container', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            expect(tabsPageObject.areScrollButtonsVisible()).toBe(false);

            await disconnect();
        });

        it('should show scroll buttons when the tabs overflow the container', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBe(true);

            await disconnect();
        });

        it('should hide scroll buttons when the tabs no longer overflow the container', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.setTabsWidth(1000);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            expect(tabsPageObject.areScrollButtonsVisible()).toBe(false);

            await disconnect();
        });

        it('should scroll left when the left scroll button is clicked', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollLeft = element.shadowRoot!.querySelector('.tablist')!.scrollLeft;
            await tabsPageObject.clickScrollLeftButton();
            expect(
                element.shadowRoot!.querySelector('.tablist')!.scrollLeft
            ).toBeLessThan(currentScrollLeft);

            await disconnect();
        });

        it('should not scroll left when the left scroll button is clicked and the first tab is active', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.clickScrollLeftButton();
            expect(
                element.shadowRoot!.querySelector('.tablist')!.scrollLeft
            ).toBe(0);

            await disconnect();
        });

        it('should scroll right when the right scroll button is clicked', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            await tabsPageObject.clickScrollRightButton();
            expect(
                element.shadowRoot!.querySelector('.tablist')!.scrollLeft
            ).toBeGreaterThan(0);

            await disconnect();
        });

        it('should not scroll right when the right scroll button is clicked and the last tab is active', async () => {
            const { element, connect, disconnect } = await setup();
            await connect();
            const tabsPageObject = new TabsPageObject(element);
            await tabsPageObject.setTabsWidth(300);
            await waitForUpdatesAsync(); // wait for the resize observer to fire
            element.activeid = '6'; // scrolls to the last tab
            const currentScrollLeft = element.shadowRoot!.querySelector('.tablist')!.scrollLeft;
            await tabsPageObject.clickScrollRightButton();
            expect(
                element.shadowRoot!.querySelector('.tablist')!.scrollLeft
            ).toBe(currentScrollLeft);

            await disconnect();
        });
    });
});
