import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorTreeItemDirective } from './nimble-anchor-tree-item.directive';
import { NimbleAnchorTreeItemRouterLinkDirective } from './nimble-anchor-tree-item-router-link.directive';
import { NimbleAnchorTreeItemRouterLinkWithHrefDirective } from './nimble-anchor-tree-item-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/anchor-tree-item';

@NgModule({
    declarations: [NimbleAnchorTreeItemDirective, NimbleAnchorTreeItemRouterLinkDirective, NimbleAnchorTreeItemRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorTreeItemDirective, NimbleAnchorTreeItemRouterLinkDirective, NimbleAnchorTreeItemRouterLinkWithHrefDirective]
})
export class NimbleAnchorTreeItemModule { }
