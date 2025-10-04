import { customElement } from '@ni/fast-element';
import {
    TabPanel as FoundationTabPanel,
    tabPanelTemplate as template
} from '@ni/fast-foundation';
import { styles } from './styles';
import { elementDefinitionContextMock } from '../utilities/models/mock';

export const tabPanelTag = 'nimble-tab-panel';

declare global {
    interface HTMLElementTagNameMap {
        [tabPanelTag]: TabPanel;
    }
}

/**
 * A nimble-styled tab panel
 */
@customElement({
    name: tabPanelTag,
    template: template(elementDefinitionContextMock, {}),
    styles
})
export class TabPanel extends FoundationTabPanel {}
