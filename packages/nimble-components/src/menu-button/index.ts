import { attr, DOM, observable } from '@microsoft/fast-element';
import { Anchor, DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import { keyArrowDown, keyArrowUp, keyEscape } from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../button/types';
import type { ToggleButton } from '../toggle-button';
import { styles } from './styles';
import { template } from './template';
import { MenuButtonPosition } from './types';
import type { AnchoredRegion } from '../anchored-region';
import '../anchored-region';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-button': MenuButton;
    }
}

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

    /**
     * Reflects the placement for the listbox when the select is open.
     *
     * @public
     */
    @attr({ attribute: 'position' })
    public position: MenuButtonPosition = MenuButtonPosition.Auto;

    /** @internal */
    @observable
    public readonly toggleButton: ToggleButton | undefined;

    public toggleButtonChanged(_prev: ToggleButton | undefined, _next: ToggleButton | undefined): void {
        if (this.region && this.toggleButton) {
            this.region.anchorElement = this.toggleButton;
        }
    }

    /** @internal */
    @observable
    public readonly region: AnchoredRegion | undefined;

    public regionChanged(_prev: AnchoredRegion | undefined, _next: AnchoredRegion | undefined): void {
        if (this.region && this.toggleButton) {
            this.region.anchorElement = this.toggleButton;
        }
    }

    /** @internal */
    @observable
    public readonly slottedMenus: HTMLElement[] | undefined;

    private focusLastItemWhenOpened = false;

    public openChanged(_prev: boolean | undefined, _next: boolean): void {
        if (this.toggleButton && !this.disabled) {
            this.toggleButton.checked = this.open;
        }

        if (!this.open) {
            // Only fire an event here if the menu is changing to being closed. Otherwise,
            // wait until the menu is actually opened before firing the event.
            this.$emit('open-change', { bubbles: false });
        }
    }

    public handleRegionLoaded(): void {
        if (this.focusLastItemWhenOpened) {
            this.focusLastMenuItem();
            this.focusLastItemWhenOpened = false;
        } else {
            this.focusMenu();
        }

        this.$emit('open-change', { bubbles: false });
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
                this.focusLastItemWhenOpened = true;
                this.open = true;
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
