import { attr, DOM, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { keyArrowDown, keyArrowUp, keyEscape } from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../button/types';
import type { ToggleButton } from '../toggle-button';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-button': MenuButton;
    }
}

/*
* TODOs:
* - Why is DOM.queueUpdate not working for focusing the menu?
* - Form association?
*/

/**
 * A nimble-styled toggle button control.
 */
export class MenuButton extends FoundationElement {
    /**
     * The appearance the button should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.Outline;

    @attr({ mode: 'boolean' })
    public open = false;

    @attr({ mode: 'boolean' })
    public disabled = false;

    /**
     * Specify as 'true' to hide the text content of the button. The button will
     * become square, and the text content will be used as the label of the button
     * for accessibility purposes.
     *
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    /** @internal */
    public readonly toggleButton: ToggleButton | undefined;

    @observable
    public readonly slottedMenus: HTMLElement[] | undefined;

    private reverseMenuFocus = false;

    public openChanged(_prev: boolean | undefined, _next: boolean): void {
        if (this.toggleButton && !this.disabled) {
            this.toggleButton.checked = this.open;
        }

        if (this.open) {
            if (this.reverseMenuFocus) {
                requestAnimationFrame(() => this.focusLastMenuItem());
            } else {
                requestAnimationFrame(() => this.focusMenu());
            }
        }
    }

    public focusoutHandler(e: FocusEvent): boolean {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (!this.contains(focusTarget)) {
            this.open = false;
            return false;
        }

        return true;
    }

    public toggleButtonChangeHandler(): void {
        this.open = this.toggleButton!.checked;
    }

    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        // eslint-disable-next-line default-case
        switch (e.key) {
            case keyArrowUp:
                this.reverseMenuFocus = true;
                this.open = true;
                this.reverseMenuFocus = false;
                return false;
            case keyArrowDown:
                this.open = true;
                return false;
        }

        return true;
    }

    public menuChangeHandler(): void {
        this.open = false;
    }

    public menuKeyDownHandler(e: KeyboardEvent): boolean {
        // eslint-disable-next-line default-case
        switch (e.key) {
            case keyEscape:
                this.open = false;
                this.toggleButton?.focus();
                return false;
        }

        return true;
    }

    private get menu(): HTMLElement | undefined {
        return this.slottedMenus?.length ? this.slottedMenus[0] : undefined;
    }

    private focusMenu(): void {
        this.menu?.focus();
    }

    private focusLastMenuItem(): void {
        const menuItems = this.menu?.querySelectorAll('[role=menuitem]');
        if (menuItems?.length) {
            const lastMenuItem = menuItems[menuItems.length - 1] as HTMLElement;
            lastMenuItem.focus();
        }
    }
}

const nimbleMenuButton = MenuButton.compose({
    baseName: 'menu-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuButton());
