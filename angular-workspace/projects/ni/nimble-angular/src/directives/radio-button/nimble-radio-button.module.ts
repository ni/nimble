import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRadioButtonControlValueAccessorDirective } from './nimble-radio-button-control-value-accessor.directive';
import { NimbleRadioButtonDirective } from './nimble-radio-button.directive';

@NgModule({
    declarations: [NimbleRadioButtonControlValueAccessorDirective, NimbleRadioButtonDirective],
    imports: [CommonModule],
    exports: [NimbleRadioButtonControlValueAccessorDirective, NimbleRadioButtonDirective]
})
export class NimbleRadioButtonModule { }
