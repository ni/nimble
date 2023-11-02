import { Directive, Input } from '@angular/core';
import type { AnchorButton } from './nimble-anchor-button.directive';
import { DisableableRouterLinkWithHrefDirective } from '../anchor-base/disableable-router-link-with-href.directive';

/**
 * Selectors used for built-in Angular RouterLink directives:
 * RouterLink: ':not(a):not(area)[routerLink]'
 * RouterLinkWithHref: 'a[routerLink],area[routerLink]'
 *
 * See https://github.com/angular/angular/blob/5957ff4163f55d814be2cf80b9909244f1ce5262/packages/router/src/directives/router_link.ts
 */

/**
 * Directive to handle nimble-anchor-button RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({ selector: 'nimble-anchor-button[nimbleRouterLink]' })
export class NimbleAnchorButtonRouterLinkWithHrefDirective extends DisableableRouterLinkWithHrefDirective<AnchorButton> {
    @Input()
    public set nimbleRouterLink(commands: never[] | string | null | undefined) {
        this.routerLink = commands;
    }
}
