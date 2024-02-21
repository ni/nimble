import { Directive } from '@angular/core';
import { type Toolbar, toolbarTag } from '@ni/nimble-components/dist/esm/toolbar';

export type { Toolbar };
export { toolbarTag };

/**
 * Directive to provide Angular integration for the toolbar.
 */
@Directive({
    selector: 'nimble-toolbar'
})
export class NimbleToolbarDirective {
}
