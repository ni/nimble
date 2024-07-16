import { DOM, attr, observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { BreadcrumbAppearance, CollapseState } from './types';
import { template } from './template';
import {
    controlSlimHeight,
    iconSize,
    mediumPadding
} from '../theme-provider/design-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-breadcrumb': Breadcrumb;
    }
}

/**
 * A nimble-styled breadcrumb
 */
export class Breadcrumb extends FoundationBreadcrumb {
    @attr
    public appearance: BreadcrumbAppearance;

    /** @internal */
    @observable
    public collapseState: CollapseState = CollapseState.none;

    /** @internal */
    @observable
    public list?: HTMLElement;

    /** @internal */
    @observable
    public collapsedItems: HTMLElement[] = [];

    // Unfortunately, after being slotted, the breadcrumb items' widths can change (possibly font loading?),
    // so we need to update the item widths and collapse state whenever the total width changes.
    private readonly observer = new ResizeObserver(() => {
        this.queueUpdateCollapseState();
    });

    private itemWidths: number[] = [];
    private updateCollapseStateQueued = false;

    public override connectedCallback(): void {
        super.connectedCallback();
        this.observer.observe(this.list!);
        window.addEventListener('resize', this.queueUpdateCollapseState);
    }

    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.observer.disconnect();
        window.removeEventListener('resize', this.queueUpdateCollapseState);
    }

    public override slottedBreadcrumbItemsChanged(): void {
        super.slottedBreadcrumbItemsChanged();
        this.queueUpdateCollapseState();
    }

    private readonly queueUpdateCollapseState: () => void = () => {
        if (
            this.$fastController.isConnected
            && !this.updateCollapseStateQueued
        ) {
            this.updateCollapseStateQueued = true;
            DOM.queueUpdate(() => this.updateCollapseState());
        }
    };

    private updateCollapseState(): void {
        this.updateCollapseStateQueued = false;

        this.updateItemWidths();
        const fullWidth = this.itemWidths.reduce((sum, width) => sum + width);
        const firstAndLastItemWidth = (this.itemWidths[0] ?? 0)
            + (this.itemWidths.length > 1 ? this.itemWidths.at(-1)! : 0);
        const partiallyCollapsedWidth = this.collapsedItemWidth + firstAndLastItemWidth;

        if (this.list!.offsetWidth < partiallyCollapsedWidth) {
            this.collapseState = CollapseState.collapseExceptCurrent;
            this.collapsedItems = this.slottedBreadcrumbItems.slice(0, -1);
        } else if (this.list!.offsetWidth < fullWidth) {
            this.collapseState = CollapseState.collapseMiddle;
            this.collapsedItems = this.slottedBreadcrumbItems.slice(1, -1);
        } else {
            this.collapseState = CollapseState.none;
            this.collapsedItems = [];
        }
    }

    private updateItemWidths(): void {
        if (this.itemWidths.length !== this.slottedBreadcrumbItems.length) {
            this.itemWidths = this.slottedBreadcrumbItems.map(
                item => item.scrollWidth
            );
            return;
        }
        for (let i = 0; i < this.slottedBreadcrumbItems.length; i++) {
            const itemWidth = this.slottedBreadcrumbItems[i]!.scrollWidth;
            // Ignore bogus widths for collapsed items
            if (itemWidth !== 0) {
                this.itemWidths[i] = itemWidth;
            }
        }
    }

    private get collapsedItemWidth(): number {
        // We need the width before it is added to the DOM, so we hardcode knowledge about the tokens involved
        return (
            parseFloat(controlSlimHeight.getValueFor(this))
            + 2 * parseFloat(mediumPadding.getValueFor(this))
            + parseFloat(iconSize.getValueFor(this))
        );
    }
}

const nimbleBreadcrumb = Breadcrumb.compose({
    baseName: 'breadcrumb',
    baseClass: FoundationBreadcrumb,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleBreadcrumb());
export const breadcrumbTag = 'nimble-breadcrumb';
