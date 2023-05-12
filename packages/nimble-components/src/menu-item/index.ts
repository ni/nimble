import { type Placement, shift, size, flip } from '@floating-ui/core';
import { autoUpdate, computePosition } from '@floating-ui/dom';
import { DOM, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    MenuItem as FoundationMenuItem,
    MenuItemOptions
} from '@microsoft/fast-foundation';
import { arrowExpanderRight16X16 } from '@ni/nimble-tokens/dist/icons/js';
import type { Menu } from '../menu';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-item': MenuItem;
    }
}

/**
 * A nimble-styled menu-item
 */
export class MenuItem extends FoundationMenuItem {
    /**
     * The container for the submenu.
     *
     * @internal
     */
    public submenuContainer?: HTMLDivElement;

    /**
     * The submenu slotted content.
     *
     * @internal
     */
    @observable
    public slottedSubmenu: HTMLElement[] = [];

    public constructor() {
        super();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (this as any).updateSubmenu = () => {
            this.updateSubmenuOverride();
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        (this as any).expandedChanged = (
            prev: boolean | undefined,
            next: boolean
        ) => {
            this.expandedChangedOverride(prev, next);
        };
    }

    public override disconnectedCallback(): void {
        this.cleanup?.();
        super.disconnectedCallback();
    }

    /**
     * Cleanup function for the submenu positioner.
     *
     * @public
     */
    public cleanup: () => void = () => {};

    /**
     * Sets the submenu and updates its position.
     *
     * @internal
     */
    protected slottedSubmenuChanged(
        _prev: HTMLElement[] | undefined,
        next: HTMLElement[]
    ): void {
        if (next.length) {
            this.submenu = next[0];
            this.updateSubmenuOverride();
        }
    }

    private expandedChangedOverride(
        _prev: boolean | undefined,
        next: boolean
    ): void {
        if (this.$fastController.isConnected) {
            if (this.submenu === undefined) {
                return;
            }
            if (next) {
                this.updateSubmenuOverride();
            } else {
                (this.submenu as Menu).collapseExpandedItem();
            }

            this.$emit('expanded-change', this, { bubbles: false });
        }
    }

    private updateSubmenuOverride(): void {
        this.cleanup?.();
        this.hasSubmenu = this.submenu !== undefined;

        if (!this.submenu || !this.expanded) {
            return;
        }

        DOM.queueUpdate(() => {
            this.cleanup = autoUpdate(
                this,
                this.slottedSubmenu[0]!,
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                async () => {
                    const fallbackPlacements: Placement[] = [
                        'left-start',
                        'right-start'
                    ];
                    const { x, y } = await computePosition(
                        this,
                        this.slottedSubmenu[0]!,
                        {
                            middleware: [
                                shift(),
                                size({
                                    apply: ({ availableWidth, rects }) => {
                                        if (
                                            availableWidth
                                            < rects.floating.width
                                        ) {
                                            fallbackPlacements.push(
                                                'bottom-end',
                                                'top-end'
                                            );
                                        }
                                    }
                                }),
                                flip({ fallbackPlacements })
                            ],
                            placement: 'right-start',
                            strategy: 'fixed'
                        }
                    );

                    Object.assign(this.submenuContainer!.style, {
                        left: `${x}px`,
                        position: 'fixed',
                        top: `${y}px`
                    });

                    this.submenuLoaded();
                }
            );
        });
    }
}

/**
 * A function that returns a nimble-menu-item registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#menuItemTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-menu-item\>
 *
 */
const nimbleMenuItem = MenuItem.compose<MenuItemOptions>({
    baseName: 'menu-item',
    baseClass: FoundationMenuItem,
    template,
    styles,
    expandCollapseGlyph: arrowExpanderRight16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuItem());
export const menuItemTag = DesignSystem.tagFor(MenuItem);
