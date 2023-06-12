import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { Directive, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import type { TableColumnAnchorCellView } from '@ni/nimble-components/dist/esm/table-column/anchor/cell-view';

/**
 * Directive to handle nimble-table-column-anchor RouterLink support.
 * Note: Clients need to use [nimbleRouterLink] instead of [routerLink], so that there
 * won't also be an active RouterLink directive incorrectly handling navigation.
 */
@Directive({
    selector: 'nimble-table-column-anchor[nimbleRouterLink]'
})
export class NimbleTableColumnAnchorRouterLinkWithHrefDirective extends RouterLinkWithHref {
    public set nimbleRouterLink(commands: unknown[] | string | null | undefined) {
        if (commands !== undefined && commands !== null) {
            throw new Error('Directly configuring the nimbleRouterLink url is not supported. The router url is configured via the href-field-name of the column.');
        }
    }

    public constructor(router: Router, route: ActivatedRoute, private readonly theLocationStrategy: LocationStrategy) {
        super(router, route, theLocationStrategy);
    }

    @HostListener('delegated-event', ['$event.detail.originalEvent'])
    private onDelegatedEvent(delegatedEvent: Event): void {
        if (delegatedEvent.type !== 'click') {
            return;
        }

        const clickEvent = delegatedEvent as MouseEvent;
        const href = (delegatedEvent.target as TableColumnAnchorCellView).cellRecord.href;

        if (!href) {
            return;
        }

        if (!this.handleLinkClick(href, clickEvent.button, clickEvent.ctrlKey, clickEvent.shiftKey, clickEvent.altKey, clickEvent.metaKey)) {
            clickEvent.preventDefault();
        }
    }

    private handleLinkClick(url: string, button: number, ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean): boolean {
        if (!(this.theLocationStrategy instanceof HashLocationStrategy)) {
            // Only attempt routing in apps not using hash-based routing
            let routerUrl = url;
            const baseHref = this.theLocationStrategy.getBaseHref();
            if (!baseHref || this.urlStartsWithBaseHref(routerUrl, baseHref)) {
                // Let the router handle this navigation
                routerUrl = this.removeBaseHrefFromUrl(routerUrl, baseHref);
                this.routerLink = routerUrl;
                const allowDefaultAction = this.onClick(button, ctrlKey, shiftKey, altKey, metaKey);
                this.routerLink = null;
                return allowDefaultAction;
            }
        }
        return true;
    }

    private urlStartsWithBaseHref(url: string, baseHref: string): boolean {
        const urlSegments = url.split('/').filter(x => x !== '');
        const baseHrefSegments = baseHref.split('/').filter(x => x !== '');

        if (urlSegments.length < baseHrefSegments.length) {
            return false;
        }

        for (let i = 0; i < baseHrefSegments.length; i++) {
            if (urlSegments[i] !== baseHrefSegments[i]) {
                return false;
            }
        }
        return true;
    }

    private removeBaseHrefFromUrl(url: string, baseHref: string): string {
        const firstNonSlashIndex = baseHref.startsWith('/') ? 1 : 0;
        const lastNonSlashIndex = baseHref.endsWith('/') ? baseHref.length - 1 : baseHref.length;
        const baseHrefWithoutSlashes = baseHref.substring(firstNonSlashIndex, lastNonSlashIndex);
        const regex = new RegExp(`^/?(${baseHrefWithoutSlashes})/?`);
        return url.replace(regex, '');
    }
}
