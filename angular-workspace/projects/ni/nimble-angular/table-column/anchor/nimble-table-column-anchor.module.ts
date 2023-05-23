import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleTableColumnAnchorDirective } from './nimble-table-column-anchor.directive';
import { NimbleTableColumnAnchorRouterLinkWithHrefDirective } from './nimble-table-column-anchor-router-link-with-href.directive';
import { NimbleTableColumnAnchorRouterLinkDirective } from './nimble-table-column-anchor-router-link.directive';

import '@ni/nimble-components/dist/esm/table-column/anchor';

@NgModule({
    declarations: [NimbleTableColumnAnchorDirective, NimbleTableColumnAnchorRouterLinkDirective, NimbleTableColumnAnchorRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleTableColumnAnchorDirective, NimbleTableColumnAnchorRouterLinkDirective, NimbleTableColumnAnchorRouterLinkWithHrefDirective]
})
export class NimbleTableColumnAnchorModule { }
