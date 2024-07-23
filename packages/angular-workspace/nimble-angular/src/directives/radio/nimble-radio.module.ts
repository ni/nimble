import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRadioControlValueAccessorDirective } from './nimble-radio-control-value-accessor.directive';
import { NimbleRadioDirective } from './nimble-radio.directive';

import '@ni/nimble-components/dist/esm/radio';

@NgModule({
    declarations: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective],
    imports: [CommonModule],
    exports: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective]
})
export class NimbleRadioModule { }
