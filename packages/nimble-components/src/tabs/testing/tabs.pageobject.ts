import { Tabs } from '..';
import { Button } from '../../button';
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
}
