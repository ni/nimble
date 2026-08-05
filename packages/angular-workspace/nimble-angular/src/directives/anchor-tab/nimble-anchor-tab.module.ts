import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorTabDirective } from './nimble-anchor-tab.directive';
import { NimbleRouterLinkDirective } from '../routerLink/nimbleRouterLink.directive';

import '@ni/nimble-components/dist/esm/anchor-tab';

@NgModule({
    declarations: [NimbleAnchorTabDirective],
    imports: [CommonModule, NimbleRouterLinkDirective],
    exports: [NimbleAnchorTabDirective, NimbleRouterLinkDirective]
})
export class NimbleAnchorTabModule { }
