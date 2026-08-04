import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorDirective } from './nimble-anchor.directive';
import { NimbleRouterLinkDirective } from '../routerLink/nimbleRouterLink.directive';

import '@ni/nimble-components/dist/esm/anchor';

@NgModule({
    declarations: [NimbleAnchorDirective],
    imports: [CommonModule, NimbleRouterLinkDirective],
    exports: [NimbleAnchorDirective, NimbleRouterLinkDirective]
})
export class NimbleAnchorModule { }
