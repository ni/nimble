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
    public readonly tabsList!: Element;

    private readonly tabListResizeObserver: ResizeObserver;

    public constructor() {
        super();
        // We disable the built-in active indicator so that we can implement our own
        this.activeindicator = false;
        this.tabListResizeObserver = new ResizeObserver(entries => {
            let tabsContainerWidth = entries[0]?.contentRect.width;
            if (tabsContainerWidth) {
                tabsContainerWidth = Math.ceil(tabsContainerWidth);
                this.showScrollButtons = tabsContainerWidth < this.tabsList.scrollWidth;
            }
        });
    }

    public override connectedCallback(): void {
        super.connectedCallback();
        this.tabListResizeObserver.observe(this.tabsList);
    }

    public onScrollLeftClick(): void {
        this.tabsList.scrollLeft = Math.max(
            0,
            this.tabsList.scrollLeft - this.tabsList.clientWidth
        );
    }

    public onScrollRightClick(): void {
        const scrollableWidth = this.tabsList.clientWidth - this.tabsList.scrollLeft;
        if (scrollableWidth < this.tabsList.scrollWidth) {
            this.tabsList.scrollLeft += this.tabsList.clientWidth;
        } else {
            this.scrollLeft = this.tabsList.scrollWidth - this.tabsList.clientWidth;
        }
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
