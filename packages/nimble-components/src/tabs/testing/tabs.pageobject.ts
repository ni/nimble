import type { Tabs } from '..';
import type { Button } from '../../button';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

/**
 * Page object for the `nimble-tabs` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class TabsPageObject {
    public constructor(protected readonly tabsElement: Tabs) {}

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
        const tab = document.createElement('nimble-tab');
        tab.textContent = label;
        const lastTab = this.tabsElement.querySelector(
            'nimble-tab:last-of-type'
        )!;
        lastTab.insertAdjacentElement('afterend', tab);
        const tabPanel = document.createElement('nimble-tab-panel');
        const lastTabPanel = this.tabsElement.querySelector(
            'nimble-tab-panel:last-of-type'
        )!;
        lastTabPanel.insertAdjacentElement('afterend', tabPanel);
        await waitForUpdatesAsync();
    }

    public async removeTab(index: number): Promise<void> {
        if (index >= this.tabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tabToRemove = this.tabsElement.tabs[index];
        tabToRemove?.remove();
        const tabPanelToRemove = this.tabsElement.querySelectorAll('nimble-tab-panel')[index];
        tabPanelToRemove?.remove();
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
}
