import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Breadcrumb } from '@ni/nimble-components/dist/esm/breadcrumb';
import { BreadcrumbAppearance } from '@ni/nimble-components/dist/esm/breadcrumb/types';

export type { Breadcrumb };
export { BreadcrumbAppearance };

/**
 * Directive to provide Angular integration for the breadcrumb.
 */
@Directive({
    selector: 'nimble-breadcrumb'
})
export class NimbleBreadcrumbDirective {
    public get appearance(): BreadcrumbAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: BreadcrumbAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Breadcrumb>) {}
}
