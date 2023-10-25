import { Directive, ElementRef, Injector, Input } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import type { AnchorMenuItem } from './nimble-anchor-menu-item.directive';

/**
 * Selectors used for built-in Angular RouterLink directives:
 * RouterLink: ':not(a):not(area)[routerLink]'
 * RouterLinkWithHref: 'a[routerLink],area[routerLink]'
 *
 * See https://github.com/angular/angular/blob/5957ff4163f55d814be2cf80b9909244f1ce5262/packages/router/src/directives/router_link.ts
 */

/**
 * Directive to handle nimble-anchor-menu-item RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({ selector: 'nimble-anchor-menu-item[nimbleRouterLink]' })
export class NimbleAnchorMenuItemRouterLinkWithHrefDirective extends RouterLinkWithHref {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }

    public constructor(injector: Injector, private readonly elementRef: ElementRef<AnchorMenuItem>) {
        super(injector.get(Router), injector.get(ActivatedRoute), injector.get(LocationStrategy));
    }

    public override onClick(button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean): boolean {
        if (this.elementRef.nativeElement.disabled) {
            return false;
        }

        return super.onClick(button, ctrlKey, shiftKey, altKey, metaKey);
    }
}
