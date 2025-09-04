import { attr, observable } from '@ni/fast-element';
import {
    DesignSystem,
    Breadcrumb as FoundationBreadcrumb
} from '@ni/fast-foundation';
import { breadcrumbTemplate as template } from './template';
import { styles } from './styles';
import type { BreadcrumbAppearance } from './types';

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

    /**
     * @internal
     */
    @observable
    public showScrollButtons = false;

    /**
     * A reference to the list div
     * @internal
     */
    public list!: HTMLElement;
    /**
     * @internal
    */
    public readonly leftScrollButton?: HTMLElement;

    private readonly listResizeObserver: ResizeObserver;

    public constructor() {
        super();
        this.listResizeObserver = new ResizeObserver(entries => {
            let listVisibleWidth = entries[0]?.contentRect.width;
            if (listVisibleWidth !== undefined) {
                const buttonWidth = this.leftScrollButton?.clientWidth ?? 0;
                listVisibleWidth = Math.ceil(listVisibleWidth);
                if (this.showScrollButtons) {
                    listVisibleWidth += buttonWidth * 2;
                }
                this.showScrollButtons = listVisibleWidth < this.list.scrollWidth;
            }
        });
    }

    /**
     * @internal
     */
    public onScrollLeftClick(): void {
        this.list.scrollBy({
            left: -this.list.clientWidth,
            behavior: 'smooth'
        });
    }

    /**
     * @internal
     */
    public onScrollRightClick(): void {
        this.list.scrollBy({
            left: this.list.clientWidth,
            behavior: 'smooth'
        });
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.listResizeObserver.observe(this.list);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.listResizeObserver.disconnect();
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
