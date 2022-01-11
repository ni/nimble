import { Directive } from '@angular/core';
import type { Select } from '@ni/nimble-components/dist/esm/select';

export type { Select };

/**
 * Directive for Nimble select control Angular integration
 */
@Directive({
    selector: 'nimble-select',
})
export class NimbleSelectDirective {
}
