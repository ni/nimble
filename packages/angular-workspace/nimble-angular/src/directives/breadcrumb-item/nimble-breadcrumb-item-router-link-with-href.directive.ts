import { LocationStrategy } from '@angular/common';
import { Directive, ElementRef, HostListener, Inject, Input, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import type { BreadcrumbItem } from '@ni/nimble-components/dist/esm/breadcrumb-item';

/**
 * Directive to handle nimble-breadcrumb-item RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-breadcrumb-item[nimbleRouterLink]',
    standalone: false
})
export class NimbleBreadcrumbItemRouterLinkWithHrefDirective extends RouterLink {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }

    public constructor(
        @Inject(Router) router: Router,
        @Inject(ActivatedRoute) route: ActivatedRoute,
        renderer: Renderer2,
        private readonly elementRef: ElementRef<BreadcrumbItem>,
        @Inject(LocationStrategy) locationStrategy?: LocationStrategy
    ) {
        super(router, route, undefined, renderer, elementRef, locationStrategy);
    }

    public override onClick(_button: number, _ctrlKey: boolean, _shiftKey: boolean, _altKey: boolean, _metaKey: boolean): boolean {
        // onClick is the 'click' @HostListener handler in RouterLinkWithHref. Override it to do nothing so that this directive
        // can be in control of when the click handler is called. This allows RouterLinkWithHref's onClick to only be called
        // when the link within the element is clicked rather than any part of the element.
        return true;
    }

    @HostListener(
        'click',
        ['$event', '$event.button', '$event.ctrlKey', '$event.shiftKey', '$event.altKey', '$event.metaKey']
    )
    public nimbleOnClick(event: MouseEvent): boolean {
        // Call onClick on the base class only when the anchor within the breadcrumb item was clicked.
        if (event.composedPath().some(el => el === this.elementRef.nativeElement.control)) {
            return super.onClick(event.button, event.ctrlKey, event.shiftKey, event.altKey, event.metaKey);
        }

        return true;
    }
}
