import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { BreadcrumbItem } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { NimbleAnchorBaseDirective } from '../anchor-base/nimble-anchor-base.directive';

export type { BreadcrumbItem };

/**
 * Directive to provide Angular integration for the breadcrumb item.
 */
@Directive({
    selector: 'nimble-breadcrumb-item'
})
export class NimbleBreadcrumbItemDirective extends NimbleAnchorBaseDirective<BreadcrumbItem> {
    public constructor(renderer: Renderer2, elementRef: ElementRef<BreadcrumbItem>) {
        super(renderer, elementRef);
    }
}
