import { observable } from '@microsoft/fast-element';
import {
    DesignSystem,
    Tabs as FoundationTabs,
    TabsOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tabs': Tabs;
    }
}

/**
 * A nimble-styled tabs control
 */
export class Tabs extends FoundationTabs {
    /**
     * @internal
     */
    @observable
    public showScrollButtons = false;

    /**
     * @internal
     */
    public readonly tabsContainer!: Element;

    /**
     * @internal
     */
    public readonly tablist!: Element;

    /**
     * @internal
     */
    public readonly leftScrollButton!: Element;

    /**
     * @internal
     */
    public readonly rightScrollButton!: Element;

    private readonly tabListResizeObserver: ResizeObserver;

    public constructor() {
        super();
        // We disable the built-in active indicator so that we can implement our own
        this.activeindicator = false;
        this.tabListResizeObserver = new ResizeObserver(entries => {
            let tabsContainerWidth = entries[0]?.contentRect.width;
            if (tabsContainerWidth) {
                const leftButtonWidth = this.leftScrollButton?.clientWidth ?? 0;
                const rightButtonWidth = this.rightScrollButton?.clientWidth ?? 0;
                tabsContainerWidth = Math.ceil(tabsContainerWidth);
                if (this.showScrollButtons) {
                    tabsContainerWidth += leftButtonWidth + rightButtonWidth;
                }
                this.showScrollButtons = tabsContainerWidth < this.tablist.scrollWidth;
            }
        });
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.tabListResizeObserver.observe(this.tablist);
    }

    public override activeidChanged(oldValue: string, newValue: string): void {
        super.activeidChanged(oldValue, newValue);
        this.activetab?.scrollIntoView();
    }

    public onScrollLeftClick(): void {
        this.tablist.scrollLeft -= this.tablist.clientWidth;
    }

    public onScrollRightClick(): void {
        this.tablist.scrollLeft += this.tablist.clientWidth;
    }
}

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName: 'tabs',
    baseClass: FoundationTabs,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
export const tabsTag = 'nimble-tabs';
