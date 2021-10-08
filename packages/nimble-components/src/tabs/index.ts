import { html } from '@microsoft/fast-element';
import {
    DesignSystem,
    Tabs,
    TabsOptions,
    tabsTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export * from '../tab';
export * from '../tab-panel';
export * from '../tabs-toolbar';

const nimbleTabs = Tabs.compose<TabsOptions>({
    baseName: 'tabs',
    template,
    styles,
    end: html`<slot name="toolbar"></slot>`
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabs());
