import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleAnchorStepDirective } from './nimble-anchor-step.directive';

import '@ni/nimble-components/dist/esm/anchor-step';

@NgModule({
    declarations: [NimbleAnchorStepDirective],
    imports: [CommonModule],
    exports: [NimbleAnchorStepDirective]
})
export class NimbleAnchorStepModule { }
