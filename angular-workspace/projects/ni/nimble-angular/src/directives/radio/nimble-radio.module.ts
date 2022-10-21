import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRadioControlValueAccessorDirective } from './nimble-radio-control-value-accessor.directive';
import { NimbleRadioDirective } from './nimble-radio.directive';

@NgModule({
    declarations: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective],
    imports: [CommonModule],
    exports: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective]
})
export class NimbleRadioModule { }
