import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleStepperDirective } from './nimble-stepper.directive';

import '@ni/nimble-components/dist/esm/stepper';

@NgModule({
    declarations: [NimbleStepperDirective],
    imports: [CommonModule],
    exports: [NimbleStepperDirective]
})
export class NimbleStepperModule { }
