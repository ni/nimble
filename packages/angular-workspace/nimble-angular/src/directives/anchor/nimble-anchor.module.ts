import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorDirective } from './nimble-anchor.directive';
import { NimbleAnchorRouterLinkDirective } from './nimble-anchor-router-link.directive';
import { NimbleAnchorRouterLinkWithHrefDirective } from './nimble-anchor-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/anchor';

@NgModule({
    declarations: [NimbleAnchorDirective, NimbleAnchorRouterLinkDirective, NimbleAnchorRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorDirective, NimbleAnchorRouterLinkDirective, NimbleAnchorRouterLinkWithHrefDirective]
})
export class NimbleAnchorModule { }
