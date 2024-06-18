import {
    keyArrowDown,
    keyArrowUp,
    keyEnter,
    keyEscape,
    keySpace
} from '@microsoft/fast-web-utilities';
import type { MenuButton } from '..';
import { waitForEventAsync } from '../../utilities/tests/component';

/**
 * Page object for `nimble-menu-button` component to provide consistent ways
 * of querying and interacting with the component during tests.
 *
 * This page object is intended to be used to interact with a `nimble-menu-button`,
 * not the menu slotted into the button or the menu items.
 */
export class MenuButtonPageObject {
    public constructor(protected readonly menuButtonElement: MenuButton) {}

    public isOpen(): boolean {
        return this.menuButtonElement.open;
    }

    public async openMenu(): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        const toggleEventPromise = waitForEventAsync(
            this.menuButtonElement,
            'toggle'
        );
        this.clickMenuButton();
        await toggleEventPromise;
    }

    public closeMenuWithEscape(): void {
        if (!this.isOpen()) {
            throw new Error('Cannot close menu when it is not open');
        }

        const event = new KeyboardEvent('keydown', {
            key: keyEscape
        });
        this.menuButtonElement.region!.dispatchEvent(event);
    }

    public getLabelText(): string {
        return this.menuButtonElement.textContent?.trim() ?? '';
    }

    /** @internal */
    public clickMenuButton(): void {
        // Focus the menu button before calling click() because ordinarily a mouse click
        // would bring focus to the button, but calling click() directly does not.
        this.menuButtonElement.focus();
        this.menuButtonElement.toggleButton!.control.click();
    }

    /** @internal */
    public pressEnterKey(): void {
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        });
        this.menuButtonElement.toggleButton!.control.dispatchEvent(event);
    }

    /** @internal */
    public pressSpaceKey(): void {
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        });
        this.menuButtonElement.toggleButton!.control.dispatchEvent(event);
    }

    /** @internal */
    public pressArrowUpKey(): void {
        const event = new KeyboardEvent('keydown', {
            key: keyArrowUp
        });
        this.menuButtonElement.toggleButton!.dispatchEvent(event);
    }

    /** @internal */
    public pressArrowDownKey(): void {
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        });
        this.menuButtonElement.toggleButton!.dispatchEvent(event);
    }
}
