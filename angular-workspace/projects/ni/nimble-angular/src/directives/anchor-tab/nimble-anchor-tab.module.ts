import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorTabDirective } from './nimble-anchor-tab.directive';
import { NimbleAnchorTabRouterLinkDirective } from './nimble-anchor-tab-router-link.directive';
import { NimbleAnchorTabRouterLinkWithHrefDirective } from './nimble-anchor-tab-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/anchor-tab';

@NgModule({
    declarations: [NimbleAnchorTabDirective, NimbleAnchorTabRouterLinkDirective, NimbleAnchorTabRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorTabDirective, NimbleAnchorTabRouterLinkDirective, NimbleAnchorTabRouterLinkWithHrefDirective]
})
export class NimbleAnchorTabModule { }
