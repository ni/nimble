import { Directive } from '@angular/core';
import { type Button, buttonTag } from '@ni/ok-components/dist/esm/button';

export type { Button };
export { buttonTag };

/**
 * Directive to provide Angular integration for the button.
 */
@Directive({
    selector: 'ok-button',
    standalone: false
})
export class OkButtonDirective { }
