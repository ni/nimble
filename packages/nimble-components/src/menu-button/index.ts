import {
    autoPlacement,
    autoUpdate,
    computePosition,
    flip,
    hide,
    shift,
    size
} from '@floating-ui/dom';
import { attr, DOM, observable } from '@microsoft/fast-element';
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
import { MenuButtonToggleEventDetail, MenuButtonPosition } from './types';
import type { ButtonPattern } from '../patterns/button/types';

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
    public readonly menu?: HTMLSpanElement;

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
        if (this.menu) {
            this.menu.removeEventListener(eventChange, this.menuChangeHandler);
        }
        this.cleanup?.();
    }

    public setPositioning(): void {
        if (!this.$fastController.isConnected || !this.menu?.isConnected) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises
        this.cleanup = autoUpdate(this, this.menu, async () => {
            const middlewareArray = [
                size({
                    apply: ({ availableHeight }) => {
                        Object.assign(this.menu!.style, {
                            maxHeight: `${availableHeight}px`,
                            width: 'fit-content'
                        });
                    }
                }),
                shift(),
                hide()
            ];
            if (this.position === MenuButtonPosition.auto) {
                middlewareArray.push(
                    autoPlacement({
                        allowedPlacements: ['top-start', 'bottom-start']
                    })
                );
            }
            const { middlewareData, x, y } = await computePosition(
                this.toggleButton!,
                this.menu!,
                {
                    placement:
                        this.position === MenuButtonPosition.above
                            ? 'top-start'
                            : 'bottom-start',
                    strategy: 'fixed',
                    middleware: middlewareArray
                }
            );

            if (middlewareData.hide?.referenceHidden) {
                this.open = false;
                return;
            }

            Object.assign(this.menu!.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                transform: `translate(${x}px, ${y}px)`
            });
        });
    }

    public menuChanged(
        prev: HTMLSpanElement | undefined,
        _next: HTMLSpanElement | undefined
    ): void {
        if (prev) {
            prev.removeEventListener(eventChange, this.menuChangeHandler);
        }

        if (this.menu) {
            this.menu.addEventListener(eventChange, this.menuChangeHandler, {
                capture: true
            });
        }
    }

    public openChanged(prev: boolean | undefined, next: boolean): void {
        if (this.toggleButton) {
            this.toggleButton.checked = this.open;
        }

        if (this.open) {
            // Apparently it takes two DOM updates before the "menu" span
            // is connected to the DOM, which we need to happen before we
            // call setPositioning.
            DOM.queueUpdate(() => {
                DOM.queueUpdate(() => {
                    this.setPositioning();

                    requestAnimationFrame(() => {
                        if (this.focusLastItemWhenOpened) {
                            this.focusLastMenuItem();
                            this.focusLastItemWhenOpened = false;
                        } else {
                            this.focusMenu();
                        }
                        const eventDetail: MenuButtonToggleEventDetail = {
                            oldState: prev ?? false,
                            newState: next
                        };
                        this.$emit('toggle', eventDetail);
                    });
                });
            });
        } else {
            this.cleanup?.();
            const eventDetail: MenuButtonToggleEventDetail = {
                oldState: prev ?? false,
                newState: next
            };
            this.$emit('toggle', eventDetail);
        }
    }

    public focusoutHandler(e: FocusEvent): boolean {
        if (!this.open) {
            return true;
        }

        const focusTarget = e.relatedTarget as HTMLElement;
        if (
            !this.contains(focusTarget)
            && !this.getMenu()?.contains(focusTarget)
        ) {
            this.setOpen(false);
            return false;
        }

        return true;
    }

    public toggleButtonCheckedChangeHandler(e: Event): boolean {
        this.setOpen(this.toggleButton!.checked);
        // Don't bubble the 'change' event from the toggle button because
        // the menu button has its own 'toggle' event.
        e.stopPropagation();
        return false;
    }

    public toggleButtonKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyArrowUp:
                this.focusLastItemWhenOpened = true;
                this.setOpen(true);
                return false;
            case keyArrowDown:
                this.setOpen(true);
                return false;
            default:
                return true;
        }
    }

    public menuKeyDownHandler(e: KeyboardEvent): boolean {
        switch (e.key) {
            case keyEscape:
                this.setOpen(false);
                this.toggleButton!.focus();
                return false;
            default:
                return true;
        }
    }

    private cleanup: () => void = () => {};

    private setOpen(newValue: boolean): void {
        if (this.open === newValue) {
            return;
        }

        const eventDetail: MenuButtonToggleEventDetail = {
            oldState: this.open,
            newState: newValue
        };
        this.$emit('beforetoggle', eventDetail);

        this.open = newValue;
    }

    private getMenu(): HTMLElement | undefined {
        // Get the menu that is slotted within the menu-button, taking into account
        // that it may be nested within multiple 'slot' elements, such as when used
        // within a table.
        if (!this.slottedMenus?.length) {
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
        if (menuItems?.length) {
            const lastMenuItem = menuItems[menuItems.length - 1] as HTMLElement;
            lastMenuItem.focus();
        }
    }

    private readonly menuChangeHandler = (): void => {
        this.setOpen(false);
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
export const menuButtonTag = DesignSystem.tagFor(MenuButton);
