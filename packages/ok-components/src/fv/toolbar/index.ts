import { attr, observable } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { Toolbar } from '@ni/nimble-components/dist/esm/toolbar';
import { Button } from '@ni/nimble-components/dist/esm/button';
import type { MenuButton } from '@ni/nimble-components/dist/esm/menu-button';
import { MenuItem, menuItemTag } from '@ni/nimble-components/dist/esm/menu-item';
import type { Menu } from '@ni/nimble-components/dist/esm/menu';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'ok-fv-toolbar': FvToolbar;
    }
}

type Presentation = 'label' | 'icon' | 'overflow';

interface ResponsiveItem {
    button: Button;
    stages: Presentation[];
    priority: number;
    contentHidden: boolean;
    hidden: boolean;
    menuItem: MenuItem;
}

/**
 * A Nimble toolbar that automatically collapses declaratively configured actions.
 */
export class FvToolbar extends Toolbar {
    @attr({ attribute: 'overflow-label' })
    public overflowLabel = 'More actions';

    /** @internal */
    @observable
    public hasOverflow = false;

    /** @internal */
    public overflowButton!: MenuButton;

    /** @internal */
    public overflowMenu!: Menu;

    private readonly items = new Map<Button, ResponsiveItem>();
    private readonly resizeObserver = new ResizeObserver(() => this.scheduleLayout());
    private readonly mutationObserver = new MutationObserver(records => {
        for (const record of records) {
            const item = record.target instanceof Button ? this.items.get(record.target) : undefined;
            if (item && record.attributeName === 'hidden') {
                item.hidden = item.button.hidden;
            }
            if (item && record.attributeName === 'content-hidden') {
                item.contentHidden = item.button.contentHidden;
            }
        }
        this.scheduleLayout();
    });

    private readonly observedChildren = new Set<Element>();
    private frame = 0;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.resizeObserver.observe(this);
        this.observeMutations();
        this.ownerDocument.fonts.addEventListener('loadingdone', this.scheduleLayout);
        this.scheduleLayout();
    }

    public override disconnectedCallback(): void {
        this.resizeObserver.disconnect();
        this.mutationObserver.disconnect();
        this.ownerDocument.fonts.removeEventListener('loadingdone', this.scheduleLayout);
        cancelAnimationFrame(this.frame);
        this.frame = 0;
        for (const item of this.items.values()) {
            this.restoreItem(item);
        }
        this.items.clear();
        this.observedChildren.clear();
        super.disconnectedCallback();
    }

    protected override get allSlottedItems(): (HTMLElement | Node)[] {
        return [
            ...super.allSlottedItems,
            ...(this.hasOverflow ? [this.overflowButton] : [])
        ];
    }

    private observeMutations(): void {
        this.mutationObserver.observe(this, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: [
                'data-responsive', 'data-priority', 'disabled', 'hidden',
                'content-hidden', 'aria-label', 'slot', 'class', 'style'
            ]
        });
    }

    private readonly scheduleLayout = (): void => {
        if (!this.isConnected || this.frame !== 0) {
            return;
        }
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            this.updateLayout();
        });
    };

    private restoreItem(item: ResponsiveItem): void {
        item.button.hidden = item.hidden;
        item.button.toggleAttribute('content-hidden', item.contentHidden);
        item.menuItem.remove();
    }

    private syncItems(): ResponsiveItem[] {
        const buttons = Array.from(this.children).filter(
            (child): child is Button => child instanceof Button && child.hasAttribute('data-responsive')
        );
        for (const [button, item] of this.items) {
            if (!buttons.includes(button)) {
                this.restoreItem(item);
                this.items.delete(button);
            }
        }
        for (const button of buttons) {
            const value = button.getAttribute('data-responsive')?.trim() ?? '';
            const tokens = value.split(/\s+/);
            const stages = (['label', 'icon', 'overflow'] as const).filter(stage => tokens.includes(stage));
            const priority = Number(button.getAttribute('data-priority') ?? 0);
            if (stages.length === 0 || tokens.some(token => !stages.some(stage => stage === token))
                || !Number.isFinite(priority)
                || (stages.includes('icon') && !button.querySelector(':scope > [slot="start"]'))) {
                throw new Error('ok-fv-toolbar requires valid data-responsive stages, a finite data-priority, and a direct start-slot icon for icon-only actions.');
            }
            let item = this.items.get(button);
            if (!item) {
                const menuItem = this.ownerDocument.createElement(menuItemTag);
                menuItem.addEventListener('change', () => {
                    if (!button.disabled) {
                        button.click();
                    }
                });
                item = {
                    button,
                    stages,
                    priority,
                    hidden: button.hidden,
                    contentHidden: button.contentHidden,
                    menuItem
                };
                this.items.set(button, item);
            }
            item.stages = stages;
            item.priority = priority;
            item.menuItem.disabled = button.disabled;
            const label = (button.getAttribute('aria-label')
                ?? Array.from(button.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE
                        || (node instanceof Element && !node.hasAttribute('slot')))
                    .map(node => node.textContent).join('')).trim();
            if (!label) {
                throw new Error('ok-fv-toolbar responsive actions require a text label or aria-label.');
            }
            if (item.menuItem.textContent !== label) {
                item.menuItem.textContent = label;
            }
        }
        return buttons.map(button => this.items.get(button)!);
    }

    private updateLayout(): void {
        // Ignore our own presentation mutations, not application changes.
        this.mutationObserver.disconnect();
        try {
            const menuFocus = this.shadowRoot?.activeElement;
            const menuHadFocus = menuFocus && this.overflowButton.contains(menuFocus);
            const previousMenuItems = Array.from(this.overflowMenu.children);
            const items = this.syncItems();
            const root = this.getRootNode();
            const activeElement = root instanceof ShadowRoot ? root.activeElement : this.ownerDocument.activeElement;
            const focusedItem = items.find(item => item.button === activeElement);
            for (const child of this.observedChildren) {
                if (child.parentElement !== this) {
                    this.resizeObserver.unobserve(child);
                    this.observedChildren.delete(child);
                }
            }
            for (const child of this.children) {
                if (!this.observedChildren.has(child)) {
                    this.resizeObserver.observe(child);
                    this.observedChildren.add(child);
                }
            }
            const overflow = new Set<ResponsiveItem>();
            for (const item of items) {
                item.button.hidden = item.hidden;
                item.button.toggleAttribute('content-hidden', item.stages[0] === 'icon');
                if (!item.hidden && item.stages[0] === 'overflow') {
                    overflow.add(item);
                    item.button.hidden = true;
                }
            }
            this.showOverflow(overflow.size > 0);
            const ordered = items.filter(item => !item.hidden).reverse()
                .sort((a, b) => a.priority - b.priority);
            // ponytail: measure each transition; cache widths only if large toolbars make this costly.
            for (const stage of ['icon', 'overflow'] as const) {
                for (const item of ordered) {
                    if (this.fits()) {
                        break;
                    }
                    if (overflow.has(item) || !item.stages.includes(stage)) {
                        continue;
                    }
                    if (stage === 'icon') {
                        item.button.toggleAttribute('content-hidden', true);
                    } else {
                        item.button.hidden = true;
                        overflow.add(item);
                        this.showOverflow(true);
                    }
                }
            }
            const overflowItems = items.filter(item => overflow.has(item));
            const nextMenuItems = overflowItems.map(item => item.menuItem);
            if (nextMenuItems.length !== previousMenuItems.length
                || nextMenuItems.some((item, index) => previousMenuItems[index] !== item)) {
                this.overflowButton.close();
                this.overflowMenu.replaceChildren(...nextMenuItems);
            }
            if (!this.hasOverflow) {
                this.overflowButton.close();
            }
            this.overflowButton.hidden = !this.hasOverflow;
            this.overflowButton.classList.remove('unreserved');
            this.reduceFocusableElements();
            if (focusedItem && overflow.has(focusedItem)) {
                this.overflowButton.focus();
            } else if (menuHadFocus) {
                if (this.hasOverflow) {
                    if (this.overflowButton.isOpen && menuFocus instanceof HTMLElement && menuFocus.isConnected) {
                        menuFocus.focus();
                    } else {
                        this.overflowButton.focus();
                    }
                } else {
                    Array.from(this.querySelectorAll<HTMLElement>('[tabindex="0"]'))
                        .find(control => !control.closest('[hidden], [disabled]'))?.focus();
                }
            }
        } finally {
            this.observeMutations();
        }
    }

    private showOverflow(show: boolean): void {
        this.hasOverflow = show;
        // Remove the trigger from width calculations without hiding its focused menu.
        this.overflowButton.classList.toggle('unreserved', !show);
        this.overflowButton.hidden = false;
    }

    private fits(): boolean {
        const region = this.shadowRoot!.querySelector<HTMLElement>('.positioning-region')!;
        return region.scrollWidth <= region.clientWidth;
    }
}

const okFvToolbar = FvToolbar.compose({
    baseName: 'fv-toolbar',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('ok').register(okFvToolbar());
export const fvToolbarTag = 'ok-fv-toolbar';
