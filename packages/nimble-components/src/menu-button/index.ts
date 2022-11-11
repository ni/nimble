import { attr, observable } from '@microsoft/fast-element';
import { DesignSystem, FoundationElement } from '@microsoft/fast-foundation';
import {
    eventChange,
    keyArrowDown,
    keyArrowUp,
    keyEscape
} from '@microsoft/fast-web-utilities';
import { ButtonAppearance } from '../button/types';
import type { ToggleButton } from '../toggle-button';
import { styles } from './styles';
import { template } from './template';
import { MenuButtonPosition } from './types';
import type { ButtonPattern } from '../patterns/button/types';
import type { AnchoredRegion } from '../anchored-region';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-button': MenuButton;
    }
}

/**
 * A nimble-styled menu button control.
 */
export class MenuButton extends FoundationElement implements ButtonPattern {
    @attr
    public appearance: ButtonAppearance = ButtonAppearance.outline;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    /**
     * Specifies whether or not the menu is open.
     */
    @attr({ mode: 'boolean' })
    public open = false;

    /**
     * Configures where the menu should be placed relative to the button that opens the menu.
     */
    @attr({ attribute: 'position' })
    public position: MenuButtonPosition = MenuButtonPosition.auto;

    /** @internal */
    @observable
    public readonly toggleButton?: ToggleButton;

    /** @internal */
    @observable
    public readonly region?: AnchoredRegion;

    /** @internal */
    @observable
    public readonly slottedMenus?: HTMLElement[];

    /**
     * Used to maintain the internal state of whether the last menu item should be focused instead
     * of the first menu item the next time the menu is opened.
     */
    private focusLastItemWhenOpened = false;

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this.region) {
            this.region.removeEventListener(
                eventChange,
                this.menuChangeHandler
            );
        }
    }

    public toggleButtonChanged(
        _prev: ToggleButton | undefined,
        _next: ToggleButton | undefined
    ): void {
        if (this.region && this.toggleButton) {
            this.region.anchorElement = this.toggleButton;
        }
    }

    public regionChanged(
        prev: AnchoredRegion | undefined,
        _next: AnchoredRegion | undefined
    ): void {
        if (prev) {
            prev.removeEventListener(eventChange, this.menuChangeHandler);
        }

        if (this.region) {
            if (this.toggleButton) {
                this.region.anchorElement = this.toggleButton;
            }
            this.region.addEventListener(eventChange, this.menuChangeHandler, {
                capture: true
            });
        }
    }

    public openChanged(_prev: boolean | undefined, _next: boolean): void {
        if (this.toggleButton) {
            this.toggleButton.checked = this.open;
        }

        if (!this.open) {
            // Only fire an event here if the menu is changing to being closed. Otherwise,
            // wait until the menu is actually opened before firing the event.
            this.$emit('open-change');
        }
    }

    public regionLoadedHandler(): void {
        if (this.focusLastItemWhenOpened) {
            this.focusLastMenuItem();
            this.focusLastItemWhenOpened = false;
        } else {
            this.focusMenu();
        }

        this.$emit('open-change');
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

    public toggleButtonCheckedChangeHandler(e: Event): boolean {
        this.open = this.toggleButton!.checked;
        // Don't bubble the 'change' event from the toggle button because
        // the menu button has its own 'open-change' event.
        e.stopPropagation();
        return false;
    }

    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyArrowUp:
                this.focusLastItemWhenOpened = true;
                this.open = true;
                return false;
            case keyArrowDown:
                this.open = true;
                return false;
            default:
                return true;
        }
    }

    public menuKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyEscape:
                this.open = false;
                this.toggleButton!.focus();
                return false;
            default:
                return true;
        }
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

    private readonly menuChangeHandler = (): void => {
        this.open = false;
        this.toggleButton!.focus();
    };
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
