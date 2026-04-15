import { Directive, ElementRef, Renderer2 } from '@angular/core';
import { type BreadcrumbItem, breadcrumbItemTag } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { NimbleAnchorBaseDirective } from '@ni/nimble-angular/anchor-base';

export type { BreadcrumbItem };
export { breadcrumbItemTag };

/**
 * Directive to provide Angular integration for the breadcrumb item.
 */
@Directive({
    selector: 'nimble-breadcrumb-item',
    standalone: false
})
export class NimbleBreadcrumbItemDirective extends NimbleAnchorBaseDirective<BreadcrumbItem> {
    public constructor(renderer: Renderer2, elementRef: ElementRef<BreadcrumbItem>) {
        super(renderer, elementRef);
    }
}
