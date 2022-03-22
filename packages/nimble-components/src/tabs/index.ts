import {
    DesignSystem,
    Tabs as FoundationTabs,
    TabsOptions,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tabs': Tabs;
    }
}

/**
 * A nimble-styled tabs control
 */
export class Tabs extends FoundationTabs {}

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName: 'tabs',
    baseClass: FoundationTabs,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
