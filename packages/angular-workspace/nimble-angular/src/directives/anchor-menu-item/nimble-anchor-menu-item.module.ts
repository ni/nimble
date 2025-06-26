import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorMenuItemDirective } from './nimble-anchor-menu-item.directive';

import '@ni/nimble-components/dist/esm/anchor-menu-item';
import { NimbleAnchorMenuItemRouterLinkWithHrefDirective } from './nimble-anchor-menu-item-router-link-with-href.directive';
import { NimbleAnchorMenuItemRouterLinkDirective } from './nimble-anchor-menu-item-router-link.directive';

@NgModule({
    declarations: [NimbleAnchorMenuItemDirective, NimbleAnchorMenuItemRouterLinkDirective, NimbleAnchorMenuItemRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorMenuItemDirective, NimbleAnchorMenuItemRouterLinkDirective, NimbleAnchorMenuItemRouterLinkWithHrefDirective]
})
export class NimbleAnchorMenuItemModule { }
