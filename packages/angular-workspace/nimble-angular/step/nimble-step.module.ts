import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleStepDirective } from './nimble-step.directive';

import '@ni/nimble-components/dist/esm/step';

@NgModule({
    declarations: [NimbleStepDirective],
    imports: [CommonModule],
    exports: [NimbleStepDirective]
})
export class NimbleStepModule { }
