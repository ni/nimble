import {
    DesignSystem,
    Tabs,
    TabsOptions,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { Tabs };

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName: 'tabs',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
