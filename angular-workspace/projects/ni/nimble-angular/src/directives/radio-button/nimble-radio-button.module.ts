import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButton } from '@ni/nimble-components/dist/esm/radio-button';
import { NimbleRadioButtonControlValueAccessorDirective } from './nimble-radio-button-control-value-accessor.directive';
import { NimbleRadioButtonDirective } from './nimble-radio-button.directive';

export { RadioButton };

@NgModule({
    declarations: [NimbleRadioButtonControlValueAccessorDirective, NimbleRadioButtonDirective],
    imports: [CommonModule],
    exports: [NimbleRadioButtonControlValueAccessorDirective, NimbleRadioButtonDirective]
})
export class NimbleRadioButtonModule { }
