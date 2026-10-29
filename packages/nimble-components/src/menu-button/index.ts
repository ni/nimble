import { attr, DOM, nullableNumberConverter, observable, Observable, volatile } from '@ni/fast-element';
import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import {
    eventChange,
    keyArrowDown,
    keyArrowUp,
    keyEscape
} from '@ni/fast-web-utilities';
import {
    ButtonAppearance,
    ButtonAppearanceVariant,
    type MenuButtonToggleEventDetail,
    MenuButtonPosition
} from './types';
import type { ToggleButton } from '../toggle-button';
import { styles } from './styles';
import { template } from './template';
import type { ButtonPattern } from '../patterns/button/types';
import type { PopoverElement } from '../patterns/popover/types';

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

    @attr({ attribute: 'appearance-variant' })
    public appearanceVariant: ButtonAppearanceVariant;

    @attr({ mode: 'boolean' })
    public disabled = false;

    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;

    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * Whether or not the menu is open.
     */
    @volatile
    public get isOpen(): boolean {
        Observable.track(this, 'isOpen');
        return this.popoverElement?.matches(':popover-open') ?? false;
    }

    public get positionAreaFallbacks(): string {
        switch (this.position) {
            case MenuButtonPosition.above:
                return 'flip-inline';
            case MenuButtonPosition.below:
                return 'flip-inline';
            default:
                return 'flip-block, flip-inline, flip-block flip-inline';
        }
    }

    /**
     * Configures where the menu should be placed relative to the button that opens the menu.
     */
    @attr({ attribute: 'position' })
    public position: MenuButtonPosition = MenuButtonPosition.auto;

    /** @internal */
    @observable
    public readonly toggleButton?: ToggleButton;

    /** @internal */
    public readonly popoverElement?: PopoverElement;

    /** @internal */
    @observable
    public readonly slottedMenus?: HTMLElement[];

    /**
     * Used to maintain the internal state of whether the last menu item should be focused instead
     * of the first menu item the next time the menu is opened.
     */
    private focusLastItemWhenOpened = false;
    private deferredOpenInProgress = false;

    /**
     * Opens the menu.
     */
    public open(): void {
        if (this.isOpen || this.deferredOpenInProgress || !this.$fastController.isConnected) {
            return;
        }

        this.popoverElement?.showPopover({ source: this.toggleButton });
    }

    /**
     * Closes the menu.
     */
    public close(): void {
        this.deferredOpenInProgress = false;
        this.popoverElement?.hidePopover();
        this.focusLastItemWhenOpened = false;
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.popoverElement?.addEventListener('beforetoggle', this.popupBeforeToggleHandler);
        this.popoverElement?.addEventListener('toggle', this.popupToggleHandler);
        this.popoverElement?.addEventListener(eventChange, this.menuChangeHandler, true);
    }

    public override disconnectedCallback(): void {
        this.deferredOpenInProgress = false;
        this.focusLastItemWhenOpened = false;
        super.disconnectedCallback();
        this.popoverElement?.removeEventListener('beforetoggle', this.popupBeforeToggleHandler);
        this.popoverElement?.removeEventListener('toggle', this.popupToggleHandler);
        this.popoverElement?.removeEventListener(eventChange, this.menuChangeHandler, true);
    }

    public focusoutHandler(e: FocusEvent): boolean {
        if (!this.isOpen) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (
            !this.contains(focusTarget)
            && !this.getMenu()?.contains(focusTarget)
        ) {
            this.close();
            return false;
        }

        return true;
    }

    public toggleButtonCheckedChangeHandler(e: Event): boolean {
        // When handling a toggle button 'change' event from user interaction, the checked state
        // of the toggle button should not match the open state of the popover, so we need to toggle
        // the popover. But if the event came from us programatically updating the toggle button,
        // to match the popover, it will already be synced, so we don't toggle it.
        if (this.toggleButton?.checked !== this.isOpen) {
            this.toggle();
        }
        // Don't bubble the 'change' event from the toggle button because
        // the menu button has its own 'toggle' event.
        e.stopPropagation();
        return false;
    }

    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyArrowUp:
                this.focusLastItemWhenOpened = true;
                this.open();
                return false;
            case keyArrowDown:
                this.open();
                return false;
            default:
                return true;
        }
    }

    public menuKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyEscape:
                this.close();
                this.toggleButton!.focus();
                return false;
            default:
                return true;
        }
    }

    private readonly popupBeforeToggleHandler = (event: ToggleEvent): void => {
        if (this.deferredOpenInProgress) {
            return;
        }

        const opening = event.newState === 'open';
        this.deferredOpenInProgress = opening;

        const eventDetail: MenuButtonToggleEventDetail = {
            oldState: event.oldState === 'open',
            newState: event.newState === 'open'
        };
        this.$emit('beforetoggle', eventDetail);

        if (opening) {
            // We will suppress opening so that we can defer it to after FAST updates have had a chance to run.
            event.preventDefault();
            DOM.queueUpdate(() => {
                if (this.deferredOpenInProgress && this.$fastController.isConnected) {
                    this.popoverElement?.showPopover({ source: this.toggleButton });
                    this.deferredOpenInProgress = false;
                }
            });
        }
    };

    private readonly popupToggleHandler = (event: ToggleEvent): void => {
        Observable.notify(this, 'isOpen');

        if (event.newState === 'open') {
            if (this.focusLastItemWhenOpened) {
                this.focusLastMenuItem();
            } else {
                this.focusMenu();
            }
        }
        this.focusLastItemWhenOpened = false;

        const eventDetail: MenuButtonToggleEventDetail = {
            oldState: event.oldState === 'open',
            newState: event.newState === 'open'
        };
        this.$emit('toggle', eventDetail);
    };

    private toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    private getMenu(): HTMLElement | undefined {
        // Get the menu that is slotted within the menu-button, taking into account
        // that it may be nested within multiple 'slot' elements, such as when used
        // within a table.
        if (!this.slottedMenus || this.slottedMenus.length === 0) {
            return undefined;
        }

        let currentItem: HTMLElement | undefined = this.slottedMenus[0];
        while (currentItem) {
            if (currentItem.getAttribute('role') === 'menu') {
                return currentItem;
            }

            if (this.isSlotElement(currentItem)) {
                const firstNode = currentItem.assignedNodes()[0];
                if (firstNode instanceof HTMLElement) {
                    currentItem = firstNode;
                } else {
                    currentItem = undefined;
                }
            } else {
                return undefined;
            }
        }

        return undefined;
    }

    private isSlotElement(
        element: HTMLElement | undefined
    ): element is HTMLSlotElement {
        return element?.nodeName === 'SLOT';
    }

    private focusMenu(): void {
        this.getMenu()?.focus();
    }

    private focusLastMenuItem(): void {
        const menuItems = this.getMenu()?.querySelectorAll('[role=menuitem]');
        if (menuItems && menuItems.length > 0) {
            const lastMenuItem = menuItems[menuItems.length - 1] as HTMLElement;
            lastMenuItem.focus();
        }
    }

    private readonly menuChangeHandler = (): void => {
        this.close();
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
export const menuButtonTag = 'nimble-menu-button';
