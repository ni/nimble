import {
    DesignSystem,
    TabPanel,
    tabPanelTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { TabPanel };

export const nimbleTabPanel = TabPanel.compose({
    baseName: 'tab-panel',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabPanel());
