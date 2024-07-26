import { Directive } from '@angular/core';
import { type Menu, menuTag } from '@ni/nimble-components/dist/esm/menu';

export type { Menu };
export { menuTag };

/**
 * Directive to provide Angular integration for the menu.
 */
@Directive({
    selector: 'nimble-menu'
})
export class NimbleMenuDirective {
}
