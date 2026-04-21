import { Directive } from '@angular/core';
import { type ExButton, exButtonTag } from '@ni/ok-components/dist/esm/ex/button';

export type { ExButton };
export { exButtonTag };

/**
 * Directive to provide Angular integration for the button.
 */
@Directive({
    selector: 'ok-ex-button',
    standalone: false
})
export class OkExButtonDirective { }
