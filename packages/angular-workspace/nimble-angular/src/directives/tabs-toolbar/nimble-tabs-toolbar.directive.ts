import { Directive } from '@angular/core';
import { type TabsToolbar, tabsToolbarTag } from '@ni/nimble-components/dist/esm/tabs-toolbar';

export type { TabsToolbar };
export { tabsToolbarTag };

/**
 * Directive to provide Angular integration for the tabs toolbar.
 */
@Directive({
    selector: 'nimble-tabs-toolbar'
})
export class NimbleTabsToolbarDirective {
}
