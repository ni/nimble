import {
    keyArrowDown,
    keyArrowUp,
    keyEnter,
    keyEscape,
    keySpace
} from '@microsoft/fast-web-utilities';
import type { MenuButton } from '..';
import { createEventListener } from '../../utilities/tests/component';

/**
 * Page object for `nimble-menu-button` component to provide consistent ways
 * of querying and interacting with the component during tests.
 */
export class MenuButtonPageObject {
    public constructor(protected readonly menuButtonElement: MenuButton) {}

    public isOpen(): boolean {
        return this.menuButtonElement.open;
    }

    public clickMenuButton(): void {
        // Focus the menu button before calling click() because ordinarily a mouse click
        // would bring focus to the button, but calling click() directly does not.
        this.menuButtonElement.focus();
        this.menuButtonElement.toggleButton!.control.click();
    }

    public async openMenu(): Promise<void> {
        if (this.isOpen()) {
            return;
        }

        const toggleListener = createEventListener(
            this.menuButtonElement,
            'toggle'
        );
        this.clickMenuButton();
        await toggleListener.promise;
    }

    public pressEnter(): void {
        const event = new KeyboardEvent('keypress', {
            key: keyEnter
        } as KeyboardEventInit);
        this.menuButtonElement.toggleButton!.control.dispatchEvent(event);
    }

    public pressSpace(): void {
        const event = new KeyboardEvent('keypress', {
            key: keySpace
        } as KeyboardEventInit);
        this.menuButtonElement.toggleButton!.control.dispatchEvent(event);
    }

    public pressArrowUp(): void {
        const event = new KeyboardEvent('keydown', {
            key: keyArrowUp
        } as KeyboardEventInit);
        this.menuButtonElement.toggleButton!.dispatchEvent(event);
    }

    public pressArrowDown(): void {
        const event = new KeyboardEvent('keydown', {
            key: keyArrowDown
        } as KeyboardEventInit);
        this.menuButtonElement.toggleButton!.dispatchEvent(event);
    }

    public closeMenuWithEscape(): void {
        if (!this.isOpen()) {
            throw new Error('Cannot close menu when it is not open');
        }

        const event = new KeyboardEvent('keydown', {
            key: keyEscape
        } as KeyboardEventInit);
        this.menuButtonElement.region!.dispatchEvent(event);
    }

    public getTextContent(): string {
        return this.menuButtonElement.textContent?.trim() ?? '';
    }
}
