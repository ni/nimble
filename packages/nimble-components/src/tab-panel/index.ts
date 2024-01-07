import {
    DesignSystem,
    TabPanel as FoundationTabPanel,
    tabPanelTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export const tabPanelTag = 'nimble-tab-panel';
declare global {
    interface HTMLElementTagNameMap {
        [tabPanelTag]: TabPanel;
    }
}

/**
 * A nimble-styled tab panel
 */
export class TabPanel extends FoundationTabPanel {}

const nimbleTabPanel = TabPanel.compose({
    baseName: tabPanelTag,
    baseClass: FoundationTabPanel,
    template,
    styles
});

DesignSystem.getOrCreate().register(nimbleTabPanel());
