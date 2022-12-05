import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { BreadcrumbItem } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { NimbleLinkBase } from '../patterns/link/nimble-link-base';

export type { BreadcrumbItem };

/**
 * Directive to provide Angular integration for the breadcrumb item.
 */
@Directive({
    selector: 'nimble-breadcrumb-item'
})
export class NimbleBreadcrumbItemDirective extends NimbleLinkBase<BreadcrumbItem> {
    public constructor(renderer: Renderer2, elementRef: ElementRef<BreadcrumbItem>) {
        super(renderer, elementRef);
    }
}
