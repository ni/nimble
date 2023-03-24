import {
    DesignSystem,
    TabPanel as FoundationTabPanel,
    tabPanelTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tab-panel': TabPanel;
    }
}

/**
 * A nimble-styled tab panel
 */
export class TabPanel extends FoundationTabPanel {}

const nimbleTabPanel = TabPanel.compose({
    baseName: 'tab-panel',
    baseClass: FoundationTabPanel,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabPanel());
export const tabPanelTag = DesignSystem.tagFor(TabPanel);
