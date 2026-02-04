import type { Button } from '../../button';
import { waitForUpdatesAsync } from '../../testing/async-helpers';
import { waitTimeout } from '../../utilities/testing/component';
import type { Breadcrumb } from '..';
import { breadcrumbItemTag } from '../../breadcrumb-item';

/**
 * Page object for the `nimble-breadcrumb`
 */
export class BreadcrumbPageObject {
    public constructor(protected readonly breadcrumbElement: Breadcrumb) {}

    public async clickBreadcrumb(index: number): Promise<void> {
        if (index >= this.breadcrumbElement.slottedBreadcrumbItems.length) {
            throw new Error(`Breadcrumb with index ${index} not found`);
        }
        this.breadcrumbElement.slottedBreadcrumbItems[index]!.click();
        await waitForUpdatesAsync();
    }

    public async pressKeyOnBreadcrumb(
        index: number,
        key: string
    ): Promise<void> {
        if (index >= this.breadcrumbElement.slottedBreadcrumbItems.length) {
            throw new Error(`Breadcrumb with index ${index} not found`);
        }
        const breadcrumb = this.breadcrumbElement.slottedBreadcrumbItems[index]!;
        breadcrumb.dispatchEvent(new KeyboardEvent('keydown', { key }));
        await waitForUpdatesAsync();
    }

    public async setBreadcrumbWidth(width: number): Promise<void> {
        this.breadcrumbElement.style.width = `${width}px`;
        await waitForUpdatesAsync();
        await waitForUpdatesAsync(); // wait for the resize observer to fire
    }

    public async clickScrollLeftButton(): Promise<void> {
        const leftButton = this.breadcrumbElement.shadowRoot!.querySelector<Button>(
            '.scroll-button.left'
        );
        if (!leftButton) {
            throw new Error('Scroll left button not found');
        }
        leftButton.click();
        await waitForUpdatesAsync();
        await waitTimeout(50); // let animation run
    }

    public async clickScrollRightButton(): Promise<void> {
        const rightButton = this.breadcrumbElement.shadowRoot!.querySelector<Button>(
            '.scroll-button.right'
        );
        if (!rightButton) {
            throw new Error('Scroll right button not found');
        }
        rightButton.click();
        await waitForUpdatesAsync();
        await waitTimeout(50); // let animation run
    }

    public areScrollButtonsVisible(): boolean {
        return (
            this.breadcrumbElement.shadowRoot!.querySelectorAll(
                '.scroll-button'
            ).length > 0
        );
    }

    public async addBreadcrumbItem(label: string): Promise<void> {
        const breadcrumbItem = document.createElement(breadcrumbItemTag);
        breadcrumbItem.textContent = label;
        const lastBreadcrumbItem = this.breadcrumbElement.querySelector(
            `${breadcrumbItemTag}:last-of-type`
        )!;
        lastBreadcrumbItem.insertAdjacentElement('afterend', breadcrumbItem);
        await waitForUpdatesAsync();
    }

    public async removeBreadcrumbItemByIndex(index: number): Promise<void> {
        if (index >= this.breadcrumbElement.slottedBreadcrumbItems.length) {
            throw new Error(`Breadcrumb item with index ${index} not found`);
        }
        const breadcrumbItemToRemove = this.breadcrumbElement.slottedBreadcrumbItems[index];
        breadcrumbItemToRemove?.remove();
        await waitForUpdatesAsync();
    }

    public async updateBreadcrumbItemLabel(
        index: number,
        label: string
    ): Promise<void> {
        if (index >= this.breadcrumbElement.slottedBreadcrumbItems.length) {
            throw new Error(`Breadcrumb item with index ${index} not found`);
        }
        const breadcrumb = this.breadcrumbElement.slottedBreadcrumbItems[index]!;
        breadcrumb.textContent = label;
        await waitForUpdatesAsync();
    }

    public async scrollBreadcrumbItemIntoViewByIndex(
        index: number
    ): Promise<void> {
        if (index >= this.breadcrumbElement.slottedBreadcrumbItems.length) {
            throw new Error(`Breadcrumb item with index ${index} not found`);
        }
        const breadcrumb = this.breadcrumbElement.slottedBreadcrumbItems[index]!;
        breadcrumb.scrollIntoView();
        await waitForUpdatesAsync();
    }

    public getBreadcrumbViewScrollOffset(): number {
        return this.breadcrumbElement.shadowRoot!.querySelector('.list')!
            .scrollLeft;
    }
}
