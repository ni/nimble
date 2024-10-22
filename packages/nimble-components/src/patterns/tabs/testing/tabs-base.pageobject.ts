import type { Button } from '../../../button';
import { waitForUpdatesAsync } from '../../../testing/async-helpers';
import type { TabsOwner } from '../types';

/**
 * Page object for the `nimble-tabs` and `nimble-anchor-tabs` components to provide
 * consistent ways of querying and interacting with the component during tests.
 */
export abstract class TabsBasePageObject<T extends TabsOwner> {
    public constructor(
        protected readonly tabsElement: T,
        protected readonly tabElementName: string,
        protected readonly tabPanelElementName?: string
    ) {}

    public async clickTab(index: number): Promise<void> {
        if (index >= this.tabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        this.tabsElement.tabs[index]!.click();
        await waitForUpdatesAsync();
    }

    public async pressKeyOnTab(index: number, key: string): Promise<void> {
        if (index >= this.tabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tab = this.tabsElement.tabs[index]!;
        tab.dispatchEvent(new KeyboardEvent('keydown', { key }));
        await waitForUpdatesAsync();
    }

    public async setTabsWidth(width: number): Promise<void> {
        this.tabsElement.style.width = `${width}px`;
        await waitForUpdatesAsync();
    }

    public async clickScrollLeftButton(): Promise<void> {
        const leftButton = this.tabsElement.shadowRoot!.querySelector<Button>(
            '.scroll-button.left'
        );
        if (!leftButton) {
            throw new Error('Scroll left button not found');
        }
        leftButton.click();
        await waitForUpdatesAsync();
    }

    public async clickScrollRightButton(): Promise<void> {
        const rightButton = this.tabsElement.shadowRoot!.querySelector<Button>(
            '.scroll-button.right'
        );
        if (!rightButton) {
            throw new Error('Scroll right button not found');
        }
        rightButton.click();
        await waitForUpdatesAsync();
    }

    public areScrollButtonsVisible(): boolean {
        return (
            this.tabsElement.shadowRoot!.querySelectorAll('.scroll-button')
                .length > 0
        );
    }

    public async addTab(label: string): Promise<void> {
        const tab = document.createElement(this.tabElementName);
        tab.textContent = label;
        const lastTab = this.tabsElement.querySelector(
            `${this.tabElementName}:last-of-type`
        )!;
        lastTab.insertAdjacentElement('afterend', tab);
        if (this.tabPanelElementName) {
            const tabPanel = document.createElement(this.tabPanelElementName);
            const lastTabPanel = this.tabsElement.querySelector(
                `${this.tabPanelElementName}:last-of-type`
            )!;
            lastTabPanel.insertAdjacentElement('afterend', tabPanel);
        }
        await waitForUpdatesAsync();
    }

    public async removeTab(index: number): Promise<void> {
        if (index >= this.tabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tabToRemove = this.tabsElement.tabs[index];
        tabToRemove?.remove();
        if (this.tabPanelElementName) {
            const tabPanelToRemove = this.tabsElement.querySelectorAll(
                this.tabPanelElementName
            )[index];
            tabPanelToRemove?.remove();
        }
        await waitForUpdatesAsync();
    }

    public async updateTabLabel(index: number, label: string): Promise<void> {
        if (index >= this.tabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tab = this.tabsElement.tabs[index]!;
        tab.textContent = label;
        await waitForUpdatesAsync();
    }

    public getTabsViewScrollOffset(): number {
        return this.tabsElement.shadowRoot!.querySelector('.tablist')!
            .scrollLeft;
    }
}
