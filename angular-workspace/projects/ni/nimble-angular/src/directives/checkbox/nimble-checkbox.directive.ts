import { Directive } from '@angular/core';
import type { Checkbox } from '@ni/nimble-components/dist/esm/checkbox';

export type { Checkbox };

/**
 * Directive to provide Angular integration for the checkbox.
 */
@Directive({
    selector: 'nimble-checkbox'
})
export class NimbleCheckboxDirective {
}
