import { Directive } from '@angular/core';
import { type AnchorTab, anchorTabTag } from '@ni/nimble-components/dist/esm/anchor-tab';
import { DisableableNimbleAnchorBaseDirective } from '../anchor-base/disableable-nimble-anchor-base.directive';

export type { AnchorTab };
export { anchorTabTag };

/**
 * Directive to provide Angular integration for the anchor tab.
 */
@Directive({
    selector: 'nimble-anchor-tab',
    standalone: false
})
export class NimbleAnchorTabDirective extends DisableableNimbleAnchorBaseDirective<AnchorTab> {
}
