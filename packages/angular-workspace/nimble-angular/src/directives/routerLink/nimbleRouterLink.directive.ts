import { Directive, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Backwards compatibility for nimbleRouterLink (now just an alias for routerLink).
 */
@Directive({
    selector: '[nimbleRouterLink]',
    // must have the same host bindings as RouterLink.
    host: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '[attr.href]': 'reactiveHref()',
    },
})
export class NimbleRouterLinkDirective extends RouterLink {
    @Input('nimbleRouterLink')
    public override set routerLink(value: string | string[] | undefined | null) {
        super.routerLink = value;
    }
}