import { Directive } from '@angular/core';
import { type TabPanel, tabPanelTag } from '@ni/nimble-components/dist/esm/tab-panel';

export type { TabPanel };
export { tabPanelTag };

/**
 * Directive to provide Angular integration for the tab panel.
 */
@Directive({
    selector: 'nimble-tab-panel'
})
export class NimbleTabPanelDirective {
}
