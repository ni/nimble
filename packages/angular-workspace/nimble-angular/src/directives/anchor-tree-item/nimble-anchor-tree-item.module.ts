import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorTreeItemDirective } from './nimble-anchor-tree-item.directive';
import { NimbleRouterLinkDirective } from '../routerLink/nimbleRouterLink.directive';

import '@ni/nimble-components/dist/esm/anchor-tree-item';

@NgModule({
    declarations: [NimbleAnchorTreeItemDirective],
    imports: [CommonModule, NimbleRouterLinkDirective],
    exports: [NimbleAnchorTreeItemDirective, NimbleRouterLinkDirective]
})
export class NimbleAnchorTreeItemModule { }
