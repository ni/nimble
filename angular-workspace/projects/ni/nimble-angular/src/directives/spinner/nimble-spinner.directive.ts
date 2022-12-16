import { Directive } from '@angular/core';
import type { Spinner } from '@ni/nimble-components/dist/esm/spinner';

export type { Spinner };

/**
 * Directive to provide Angular integration for the spinner.
 */
@Directive({
    selector: 'nimble-spinner'
})
export class NimbleSpinnerDirective {
}
