import {
    DesignSystem,
    Tabs,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export * from '../tab';
export * from '../tab-panel';

const nimbleTabs = Tabs.compose({
    baseName: 'tabs',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
