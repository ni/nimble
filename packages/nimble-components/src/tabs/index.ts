import { customElement, observable } from '@ni/fast-element';
import { Tabs as FoundationTabs } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from '../patterns/tabs/template';
import type { TabsOwner } from '../patterns/tabs/types';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const tabsTag = 'nimble-tabs';

declare global {
    interface HTMLElementTagNameMap {
        [tabsTag]: Tabs;
    }
}

/**
 * A nimble-styled tabs control
 */
@customElement({
    name: tabsTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class Tabs extends FoundationTabs implements TabsOwner {
    /**
     * @internal
     */
    @observable
    public showScrollButtons = false;

    /**
     * @internal
     */
    public readonly tablist!: HTMLElement;

    /**
     * @internal
     */
    public readonly leftScrollButton?: HTMLElement;

    /**
     * @internal
     */
    public readonly tabSlotName = 'tab';

    private readonly tabListResizeObserver: ResizeObserver;

    public constructor() {
        super();
        // We disable the built-in active indicator so that we can implement our own
        this.activeindicator = false;
        this.tabListResizeObserver = new ResizeObserver(entries => {
            let tabListVisibleWidth = entries[0]?.contentRect.width;
            if (tabListVisibleWidth !== undefined) {
                const buttonWidth = this.leftScrollButton?.clientWidth ?? 0;
                tabListVisibleWidth = Math.ceil(tabListVisibleWidth);
                if (this.showScrollButtons) {
                    tabListVisibleWidth += buttonWidth * 2;
                }
                this.showScrollButtons = tabListVisibleWidth < this.tablist.scrollWidth;
            }
        });
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();
        this.tabListResizeObserver.observe(this.tablist);
    }

    /**
     * @internal
     */
    public override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.tabListResizeObserver.disconnect();
    }

    /**
     * @internal
     */
    public override activeidChanged(oldValue: string, newValue: string): void {
        super.activeidChanged(oldValue, newValue);
        this.activetab?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    /**
     * @internal
     */
    public onScrollLeftClick(): void {
        this.tablist.scrollBy({
            left: -this.tablist.clientWidth,
            behavior: 'smooth'
        });
    }

    /**
     * @internal
     */
    public onScrollRightClick(): void {
        this.tablist.scrollBy({
            left: this.tablist.clientWidth,
            behavior: 'smooth'
        });
    }
}
