import { Directive } from '@angular/core';
import type { TabPanel } from '@ni/nimble-components/dist/esm/tab-panel';

export type { TabPanel };

/**
 * Directive to provide Angular integration for the tab panel.
 */
@Directive({
    selector: 'nimble-tab-panel'
})
export class NimbleTabPanelDirective {
}
