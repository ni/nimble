import {
    DesignSystem,
    TabPanel as FoundationTabPanel,
    tabPanelTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

export type { TabPanel };

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tab-panel': TabPanel;
    }
}

/**
 * A nimble-styled tab panel
 */
class TabPanel extends FoundationTabPanel {}

const nimbleTabPanel = TabPanel.compose({
    baseName: 'tab-panel',
    baseClass: FoundationTabPanel,
    // @ts-expect-error FAST templates have incorrect type, see: https://github.com/microsoft/fast/issues/5047
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTabPanel());
