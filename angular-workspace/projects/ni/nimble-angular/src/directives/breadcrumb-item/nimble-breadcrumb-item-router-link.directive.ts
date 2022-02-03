import { Directive } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';

/**
 * Selectors used for built-in Angular RouterLink directives:
 * RouterLink: ':not(a):not(area)[routerLink]'
 * RouterLinkWithHref: 'a[routerLink],area[routerLink]'
 *
 * See https://github.com/angular/angular/blob/master/packages/router/src/directives/router_link.ts
 */

/**
 * Directive to handle nimble-breadcrumb-item being used with [routerLink].
 * Note: NimbleBreadcrumbItemDirective also has code to prevent the regular RouterLink from handling
 * navigation in this scenario.
 */
@Directive({ selector: 'nimble-breadcrumb-item[routerLink]' })
export class NimbleBreadcrumbItemRouterLinkWithHrefDirective extends RouterLinkWithHref {
}
