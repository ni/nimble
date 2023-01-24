// Based on:
// https://github.com/microsoft/fast/blob/6bce27d0b2d654650b8751bf055f5e3b5a4f9250/packages/web-components/fast-foundation/src/tabs/tabs.ts
// The code is heavily modified such that a diff against the original is useless.
// Primary differences are:
// - Reimplemented active tab indicator and removed attribute to disable it
// - Separated tab focus and tab selection, i.e. can focus a different tab than the selected one
// - Removed everything related to tab panels
// - Removed support for vertical tab orientation
// - Removed change event
// - Conforms to our linter rules
import { attr, observable } from '@microsoft/fast-element';
import {
    keyArrowLeft,
    keyArrowRight,
    keyEnd,
    keyEnter,
    keyHome,
    keySpace,
    uniqueId
} from '@microsoft/fast-web-utilities';
import {
    DesignSystem,
    StartEnd,
    applyMixins,
    StartEndOptions,
    FoundationElementDefinition,
    FoundationElement
} from '@microsoft/fast-foundation';
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
    public activeid?: string;

    /**
     * @internal
     */
    @observable
    public tabs!: HTMLElement[];

    /**
     * A reference to the active tab
     * @public
     */
    public activetab?: HTMLElement;

    /**
     * A reference to the tablist div
     * @internal
     */
    public tablist!: HTMLElement;

    private tabIds: string[] = [];

    /**
     * @internal
     */
    public activeidChanged(_oldValue: string, _newValue: string): void {
        if (this.$fastController.isConnected) {
            this.setTabs();
        }
    }

    /**
     * @internal
     */
    public tabsChanged(): void {
        if (this.$fastController.isConnected) {
            this.tabIds = this.getTabIds();
            this.setTabs();
        }
    }

    /**
     * @internal
     */
    public override connectedCallback(): void {
        super.connectedCallback();

        this.tabIds = this.getTabIds();
    }

    private readonly isDisabledElement = (el: Element): el is HTMLElement => {
        return el.getAttribute('aria-disabled') === 'true';
    };

    private readonly isFocusableElement = (el: Element): el is HTMLElement => {
        return !this.isDisabledElement(el);
    };

    private readonly setTabs = (): void => {
        const gridHorizontalProperty = 'gridColumn';
        const gridVerticalProperty = 'gridRow';

        this.activetab = undefined;
        let firstFocusableTab: HTMLElement | undefined;
        this.tabs.forEach((tab: HTMLElement, index: number) => {
            const tabId: string = this.tabIds[index]!;
            const isActiveTab = this.activeid === tabId;
            if (!firstFocusableTab && this.isFocusableElement(tab)) {
                firstFocusableTab = tab;
            }
            const isTabStop = this.activeid === tabId && this.isFocusableElement(tab);
            tab.setAttribute('id', tabId);
            tab.setAttribute('aria-selected', isActiveTab ? 'true' : 'false');
            tab.removeEventListener('click', this.handleTabClick);
            tab.addEventListener('click', this.handleTabClick);
            tab.removeEventListener('keydown', this.handleTabKeyDown);
            tab.addEventListener('keydown', this.handleTabKeyDown);
            tab.setAttribute('tabindex', isTabStop ? '0' : '-1');
            if (isActiveTab) {
                this.activetab = tab;
            }

            tab.style[gridVerticalProperty] = '';
            tab.style[gridHorizontalProperty] = `${index + 1}`;
        });

        if (
            firstFocusableTab
            && (!this.activetab || !this.isFocusableElement(this.activetab))
        ) {
            firstFocusableTab.setAttribute('tabindex', '0');
        }
    };

    private getTabIds(): string[] {
        return this.tabs.map((tab: HTMLElement) => {
            return tab.getAttribute('id') ?? `tab-${uniqueId()}`;
        });
    }

    private readonly handleTabClick = (event: MouseEvent): void => {
        const selectedTab = event.currentTarget as HTMLElement;
        if (
            selectedTab.nodeType === 1
            && this.isFocusableElement(selectedTab)
        ) {
            this.tabs.forEach((tab: HTMLElement) => {
                tab.setAttribute('tabindex', tab === selectedTab ? '0' : '-1');
            });
        }
    };

    private readonly handleTabKeyDown = (event: KeyboardEvent): void => {
        let anchor;
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
                this.focusFirstOrLast(false);
                break;
            case keyEnd:
                event.preventDefault();
                this.focusFirstOrLast(true);
                break;
            case keySpace:
            case keyEnter:
                event.preventDefault();
                this.getTabAnchor(event.target as AnchorTab).click();
                break;
            case 'ContextMenu':
                event.preventDefault();
                anchor = this.getTabAnchor(event.target as AnchorTab);
                anchor.focus();
                anchor.dispatchEvent(
                    new KeyboardEvent('keydown', {
                        key: event.key,
                        bubbles: false
                    })
                );
                break;
            default:
            // do nothing
        }
    };

    private focusFirstOrLast(focusLast: boolean): void {
        const focusableTabs = this.tabs.filter(t => !this.isDisabledElement(t));
        const focusableIndex = focusLast ? focusableTabs.length - 1 : 0;
        const index = this.tabs.indexOf(focusableTabs[focusableIndex]!);
        if (index > -1) {
            this.focusTabByIndex(this.tabs, index);
        }
    }

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

    private readonly focusTabByIndex = (
        group: HTMLElement[],
        index: number
    ): void => {
        const focusedTab: HTMLElement = group[index]!;
        focusedTab.focus();

        this.tabs.forEach((tab: HTMLElement) => {
            tab.setAttribute('tabindex', tab === focusedTab ? '0' : '-1');
        });
    };

    private getTabAnchor(tab: AnchorTab): HTMLAnchorElement {
        return tab.shadowRoot!.querySelector('a')!;
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
