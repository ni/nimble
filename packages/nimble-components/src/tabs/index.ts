import {
    DesignSystem,
    Tabs as FoundationTabs,
    TabsOptions,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'tabs';
export const tabsTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [tabsTag]: Tabs;
    }
}

/**
 * A nimble-styled tabs control
 */
export class Tabs extends FoundationTabs {
    public constructor() {
        super();
        // We disable the built-in active indicator so that we can implement our own
        this.activeindicator = false;
    }
}

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName,
    baseClass: FoundationTabs,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
