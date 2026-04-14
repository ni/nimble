import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorStepDirective } from './nimble-anchor-step.directive';
import { NimbleAnchorStepRouterLinkDirective } from './nimble-anchor-step-router-link.directive';
import { NimbleAnchorStepRouterLinkWithHrefDirective } from './nimble-anchor-step-router-link-with-href.directive';

import '@ni/nimble-components/dist/esm/anchor-step';

@NgModule({
    declarations: [NimbleAnchorStepDirective, NimbleAnchorStepRouterLinkDirective, NimbleAnchorStepRouterLinkWithHrefDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorStepDirective, NimbleAnchorStepRouterLinkDirective, NimbleAnchorStepRouterLinkWithHrefDirective]
})
export class NimbleAnchorStepModule { }