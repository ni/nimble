import {
    DesignSystem,
    Tabs as FoundationTabs,
    TabsOptions,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { Tabs };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tabs': Tabs;
    }
}

/**
 * A nimble-styled tabs control
 */
class Tabs extends FoundationTabs {}

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName: 'tabs',
    baseClass: FoundationTabs,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
