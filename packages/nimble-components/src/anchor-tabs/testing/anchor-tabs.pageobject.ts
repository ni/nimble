import type { AnchorTabs } from '..';
import type { Button } from '../../button';
import { waitForUpdatesAsync } from '../../testing/async-helpers';

/**
 * Page object for the `nimble-anchor-tabs` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class AnchorTabsPageObject {
    public constructor(protected readonly anchorTabsElement: AnchorTabs) {}

    public async setAnchorTabsWidth(width: number): Promise<void> {
        this.anchorTabsElement.style.width = `${width}px`;
        await waitForUpdatesAsync();
    }

    public async clickScrollLeftButton(): Promise<void> {
        const leftButton = this.anchorTabsElement.shadowRoot!.querySelector<Button>(
            '.scroll-button.left'
        );
        if (!leftButton) {
            throw new Error('Scroll left button not found');
        }
        leftButton.click();
        await waitForUpdatesAsync();
    }

    public async clickScrollRightButton(): Promise<void> {
        const rightButton = this.anchorTabsElement.shadowRoot!.querySelector<Button>(
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
            this.anchorTabsElement.shadowRoot!.querySelectorAll(
                '.scroll-button'
            ).length > 0
        );
    }

    public async addTab(label: string): Promise<void> {
        const tab = document.createElement('nimble-anchor-tab');
        tab.textContent = label;
        const lastTab = this.anchorTabsElement.querySelector(
            'nimble-anchor-tab:last-of-type'
        )!;
        lastTab.insertAdjacentElement('afterend', tab);
        await waitForUpdatesAsync();
    }

    public async removeTab(index: number): Promise<void> {
        if (index >= this.anchorTabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tabToRemove = this.anchorTabsElement.tabs[index];
        tabToRemove?.remove();
        await waitForUpdatesAsync();
    }

    public async updateTabLabel(index: number, label: string): Promise<void> {
        if (index >= this.anchorTabsElement.tabs.length) {
            throw new Error(`Tab with index ${index} not found`);
        }
        const tab = this.anchorTabsElement.tabs[index]!;
        tab.textContent = label;
        await waitForUpdatesAsync();
    }
}
