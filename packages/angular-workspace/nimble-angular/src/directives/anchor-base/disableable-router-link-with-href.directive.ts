import { Directive, ElementRef, Inject, Renderer2 } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

/**
 * Base class for Nimble router link directives that go on disableable elements
 * @internal
 */
@Directive()
export class DisableableRouterLinkWithHrefDirective<T extends { disabled: boolean }> extends RouterLink {
    public constructor(
        @Inject(Router) router: Router,
        @Inject(ActivatedRoute) route: ActivatedRoute,
        renderer: Renderer2,
        private readonly elementRef: ElementRef<T>,
        @Inject(LocationStrategy) locationStrategy?: LocationStrategy
    ) {
        super(router, route, undefined, renderer, elementRef, locationStrategy);
    }

    public override onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean): boolean {
        if (this.elementRef.nativeElement.disabled) {
            return false;
        }

        return super.onClick(button, ctrlKey, shiftKey, altKey, metaKey);
    }
}
