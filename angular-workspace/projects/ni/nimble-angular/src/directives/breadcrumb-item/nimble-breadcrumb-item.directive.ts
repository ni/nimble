import { AfterContentInit, Directive, ElementRef, Inject, Input, OnDestroy, Optional, Renderer2, Self } from '@angular/core';
import type { BreadcrumbItem } from '@ni/nimble-components/dist/esm/breadcrumb-item';
import { NimbleBreadcrumbItemRouterLinkWithHrefDirective } from './nimble-breadcrumb-item-router-link.directive';

export type { BreadcrumbItem };

/**
 * Directive to provide Angular integration for the breadcrumb item.
 */
@Directive({
    selector: 'nimble-breadcrumb-item'
})
export class NimbleBreadcrumbItemDirective implements AfterContentInit, OnDestroy {
    private breadcrumbChildClickUnlisten?: () => void;

    public get href(): string {
        return this.elementRef.nativeElement.href;
    }

    @Input() public set href(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'href', value);
    }

    /* TODO handle additional attributes besides href */

    public constructor(private readonly elementRef: ElementRef<BreadcrumbItem>,
        private readonly renderer: Renderer2,
        @Optional() @Inject(NimbleBreadcrumbItemRouterLinkWithHrefDirective) @Self() private readonly routerLink?: NimbleBreadcrumbItemRouterLinkWithHrefDirective) {
    }

    public ngAfterContentInit(): void {
        if (this.routerLink) {
            /*
                If this breadcrumb item is used with [routerLink], we'll have both RouterLink + NimbleBreadcrumbItemRouterLinkWithHref directives active on it,
                both trying to handle clicks/ navigation.
                We want to prevent RouterLink.onClick() handler from being called, because otherwise, when Ctrl-Clicking the breadcrumb link, we'll open the URL
                in a new window (expected) as well as triggering a navigation on the current page (incorrect).
                In current versions of Angular there's no direct way to tell RouterLink to stop handling navigations - see
                https://github.com/angular/angular/commit/ccb09b4558a3864fb5b2fe2214d08f1c1fe2758f
                In Angular v14+, we could do
                @Optional() @Inject(RouterLinkWithHref) @Self() private readonly routerLinkWithHref
                in the constructor, and set routerLinkWithHref.routerLink = null/undefined.
                However in earlier/current Angular versions, that's equivalent to routerLink=[] (nav to current page again but clear query params / state)

                (Another option would be to have a click listener on elementRef.nativeElement with useCapture = true)
            */
            const childOfClickListenerTargets = this.elementRef.nativeElement.shadowRoot!.firstElementChild as HTMLElement;
            this.breadcrumbChildClickUnlisten = this.renderer.listen(childOfClickListenerTargets, 'click', (evt: MouseEvent) => {
                evt.stopPropagation();
                // The stopPropagation call also prevented our own NimbleBreadcrumbItemRouterLinkWithHref.onClick() from being called, so call it ourselves
                const result = this.routerLink!.onClick(evt.button, evt.ctrlKey, evt.shiftKey, evt.altKey, evt.metaKey);
                if (!result) {
                    evt.preventDefault();
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.breadcrumbChildClickUnlisten?.();
    }
}
