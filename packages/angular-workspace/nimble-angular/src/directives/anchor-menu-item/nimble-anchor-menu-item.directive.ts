import { Directive } from '@angular/core';
import { type AnchorMenuItem, anchorMenuItemTag } from '@ni/nimble-components/dist/esm/anchor-menu-item';
import { DisableableNimbleAnchorBaseDirective } from '../anchor-base/disableable-nimble-anchor-base.directive';

export type { AnchorMenuItem };
export { anchorMenuItemTag };

/**
 * Directive to provide Angular integration for the anchor menu item.
 */
@Directive({
    selector: 'nimble-anchor-menu-item',
    standalone: false
})
export class NimbleAnchorMenuItemDirective extends DisableableNimbleAnchorBaseDirective<AnchorMenuItem> {
}
