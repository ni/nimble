import {
    DesignSystem,
    TabPanel as FoundationTabPanel,
    tabPanelTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

const baseName = 'tab-panel';
export const tabPanelTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationTabPanel,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabPanel());
