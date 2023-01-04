import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorButtonDirective } from './nimble-anchor-button.directive';
import { NimbleAnchorButtonRouterLinkDirective } from './nimble-anchor-button-router-link.directive';
import { NimbleAnchorButtonRouterLinkWithHrefDirective } from './nimble-anchor-button-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/anchor-button';

@NgModule({
    declarations: [NimbleAnchorButtonDirective, NimbleAnchorButtonRouterLinkDirective, NimbleAnchorButtonRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorButtonDirective, NimbleAnchorButtonRouterLinkDirective, NimbleAnchorButtonRouterLinkWithHrefDirective]
})
export class NimbleAnchorButtonModule { }
