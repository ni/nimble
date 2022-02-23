import { Directive } from '@angular/core';
import type { Breadcrumb } from '@ni/nimble-components/dist/esm/breadcrumb';

export type { Breadcrumb };

/**
 * Directive to provide Angular integration for the breadcrumb.
 */
@Directive({
    selector: 'nimble-breadcrumb'
})
export class NimbleBreadcrumbDirective {
}
