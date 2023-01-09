import { attr, observable } from '@microsoft/fast-element';
import {
    keyArrowLeft,
    keyArrowRight,
    keyEnd,
    keyEnter,
    keyHome,
    keySpace,
    limit,
    uniqueId,
} from '@microsoft/fast-web-utilities';
import { DesignSystem, StartEnd, applyMixins, StartEndOptions, FoundationElementDefinition, FoundationElement } from '@microsoft/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { AnchorTab } from '../anchor-tab';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-tabs': AnchorTabs;
    }
}

export type TabsOptions = FoundationElementDefinition & StartEndOptions;

/**
 * A nimble-styled set of anchor tabs
 */
export class AnchorTabs extends FoundationElement {
    /**
     * The id of the active tab
     *
     * @public
     * @remarks
     * HTML Attribute: activeid
     */
    @attr
    public activeid = '';

    /**
     * @internal
     */
    @observable
    public tabs!: HTMLElement[];

    /**
     * A reference to the active tab
     * @public
     */
    public activetab: HTMLElement | undefined;

    private prevActiveTabIndex = -1;
    private activeTabIndex = 0;
    private tabIds: string[] = [];

    /**
     * @internal
     */
    public activeidChanged(oldValue: string, newValue: string): void {
        if (
            this.$fastController.isConnected
        ) {
            this.prevActiveTabIndex = this.tabs.findIndex(
                (item: HTMLElement) => item.id === oldValue
            );
            this.setTabs();
            this.activateTab(this.tabs.findIndex(
                (item: HTMLElement) => item.id === newValue
            ));
            // this.setTabPanels();
            // this.handleActiveIndicatorPosition();
        }
    }

    /**
     * @internal
     */
    public tabsChanged(): void {
        if (
            this.$fastController.isConnected
        ) {
            this.tabIds = this.getTabIds();

            this.setTabs();
            this.setComponent();
            // this.setTabPanels();
            // this.handleActiveIndicatorPosition();
        }
    }

    /**
     * The adjust method for FASTTabs
     * @public
     * @remarks
     * This method allows the active index to be adjusted by numerical increments
     */
    public adjust(adjustment: number): void {
        const focusableTabs = this.tabs.filter(t => !this.isDisabledElement(t));
        const currentActiveTabIndex = focusableTabs.indexOf(this.activetab!);

        const nextTabIndex = limit(
            0,
            focusableTabs.length - 1,
            currentActiveTabIndex + adjustment
        );

        // the index of the next focusable tab within the context of all available tabs
        const nextIndex = this.tabs.indexOf(focusableTabs[nextTabIndex]!);

        if (nextIndex > -1) {
            this.focusTabByIndex(this.tabs, nextIndex);
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.tabIds = this.getTabIds();
        this.activeTabIndex = this.getActiveIndex();
    }

    private readonly change = (): void => {
        this.$emit('change', this.activetab);
    };

    private readonly isDisabledElement = (el: Element): el is HTMLElement => {
        return el.getAttribute('aria-disabled') === 'true';
    };

    private readonly isFocusableElement = (el: Element): el is HTMLElement => {
        return !this.isDisabledElement(el);
    };

    private getActiveIndex(): number {
        const id: string = this.activeid;
        if (id !== undefined) {
            return !this.tabIds.includes(this.activeid)
                ? 0
                : this.tabIds.indexOf(this.activeid);
        }
        return 0;
    }

    private readonly setTabs = (): void => {
        const gridHorizontalProperty = 'gridColumn';
        const gridVerticalProperty = 'gridRow';

        this.activeTabIndex = this.getActiveIndex();
        // this.showActiveIndicator = false;
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            if (tab.slot === 'anchortab') {
                const isActiveTab = this.activeTabIndex === index && this.isFocusableElement(tab);
                // if (!this.hideActiveIndicator && this.isFocusableElement(tab)) {
                //    this.showActiveIndicator = true;
                // }
                const tabId: string = this.tabIds[index]!;
                tab.setAttribute('id', tabId);
                tab.setAttribute('aria-selected', isActiveTab ? 'true' : 'false');
                tab.addEventListener('click', this.handleTabClick);
                tab.addEventListener('keydown', this.handleTabKeyDown);
                tab.setAttribute('tabindex', isActiveTab ? '0' : '-1');
                if (isActiveTab) {
                    this.activetab = tab;
                }
            }

            // If the original property isn't emptied out,
            // the next set will morph into a grid-area style setting that is not what we want
            tab.style[gridVerticalProperty] = '';
            tab.style[gridHorizontalProperty] = `${index + 1}`;
        });
    };

    private getTabIds(): string[] {
        return this.tabs.map((tab: HTMLElement) => {
            return tab.getAttribute('id') ?? `tab-${uniqueId()}`;
        });
    }

    private setComponent(): void {
        if (this.activeTabIndex !== this.prevActiveTabIndex) {
            this.activeid = this.tabIds[this.activeTabIndex]!;
            this.focusTab();
            this.change();
        }
    }

    private readonly handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.currentTarget as HTMLElement;
        if (selectedTab.nodeType === 1 && this.isFocusableElement(selectedTab)) {
            this.prevActiveTabIndex = this.activeTabIndex;
            this.activeTabIndex = this.tabs.indexOf(selectedTab);
            this.setComponent();
        }
    };

    private readonly handleTabKeyDown = (event: KeyboardEvent): void => {
        switch (event.key) {
            case keyArrowLeft:
                event.preventDefault();
                this.adjustBackward();
                break;
            case keyArrowRight:
                event.preventDefault();
                this.adjustForward();
                break;
            case keyHome:
                event.preventDefault();
                this.adjust(-this.activeTabIndex);
                break;
            case keyEnd:
                event.preventDefault();
                this.adjust(this.tabs.length - this.activeTabIndex - 1);
                break;
            case keySpace:
            case keyEnter:
                event.preventDefault();
                event.target?.dispatchEvent(new Event('click'));
                break;
            default:
                // do nothing
        }
    };

    /*
    private handleActiveIndicatorPosition(): void {
        // Ignore if we click twice on the same tab
        if (
            this.showActiveIndicator &&
            !this.hideActiveIndicator &&
            this.activeTabIndex !== this.prevActiveTabIndex
        ) {
            if (this.ticking) {
                this.ticking = false;
            } else {
                this.ticking = true;
                this.animateActiveIndicator();
            }
        }
    }

    private animateActiveIndicator(): void {
        this.ticking = true;
        const gridProperty: string = this.isHorizontal() ? 'gridColumn' : 'gridRow';
        const translateProperty: string = this.isHorizontal()
            ? 'translateX'
            : 'translateY';
        const offsetProperty: string = this.isHorizontal() ? 'offsetLeft' : 'offsetTop';
        const prev: number = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
        const next: number = this.activeIndicatorRef[offsetProperty];
        this.activeIndicatorRef.style[gridProperty] = `${this.prevActiveTabIndex + 1}`;
        const dif: number = next - prev;
        this.activeIndicatorRef.style.transform = `${translateProperty}(${dif}px)`;
        this.activeIndicatorRef.classList.add('activeIndicatorTransition');
        this.activeIndicatorRef.addEventListener('transitionend', () => {
            this.ticking = false;
            this.activeIndicatorRef.style[gridProperty] = `${this.activeTabIndex + 1}`;
            this.activeIndicatorRef.style.transform = `${translateProperty}(0px)`;
            this.activeIndicatorRef.classList.remove('activeIndicatorTransition');
        });
    }
    */

    private readonly adjustForward = (): void => {
        const group: HTMLElement[] = this.tabs;
        let index = 0;

        const focusedTab = group.find(x => x === document.activeElement);

        index = focusedTab ? group.indexOf(focusedTab) + 1 : 1;
        if (index === group.length) {
            index = 0;
        }

        while (index < group.length && group.length > 1) {
            if (this.isFocusableElement(group[index]!)) {
                this.focusTabByIndex(group, index);
                break;
            } else if (focusedTab && index === group.indexOf(focusedTab)) {
                break;
            } else if (index + 1 >= group.length) {
                index = 0;
            } else {
                index += 1;
            }
        }
    };

    private readonly adjustBackward = (): void => {
        const group: HTMLElement[] = this.tabs;
        let index = 0;

        const focusedTab = group.find(x => x === document.activeElement);

        index = focusedTab ? group.indexOf(focusedTab) - 1 : 0;
        index = index < 0 ? group.length - 1 : index;

        while (index >= 0 && group.length > 1) {
            if (this.isFocusableElement(group[index]!)) {
                this.focusTabByIndex(group, index);
                break;
            } else if (index - 1 < 0) {
                index = group.length - 1;
            } else {
                index -= 1;
            }
        }
    };

    private readonly focusTabByIndex = (group: HTMLElement[], index: number): void => {
        const tab: HTMLElement = group[index]!;
        // this.activetab = tab;
        // this.prevActiveTabIndex = this.activeTabIndex;
        // this.activeTabIndex = index;
        tab.focus();
        // this.setComponent();
    };

    private focusTab(): void {
        this.tabs[this.activeTabIndex]!.focus();
    }

    private activateTab(index: number): void {
        const tab = this.tabs[index] as AnchorTab;
        tab.shadowRoot?.querySelector('a')!.click();
    }
}
applyMixins(AnchorTabs, StartEnd);

const nimbleAnchorTabs = AnchorTabs.compose<TabsOptions>({
    baseName: 'anchor-tabs',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: false
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorTabs());
