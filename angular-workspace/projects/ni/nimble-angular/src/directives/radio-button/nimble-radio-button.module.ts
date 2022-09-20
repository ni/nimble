import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButton } from '@ni/nimble-components/dist/esm/radio-button';
import { NimbleRadioButtonControlValueAccessorDirective } from './nimble-radio-button-control-value-accessor.directive';

export { RadioButton };

@NgModule({
    declarations: [NimbleRadioButtonControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleRadioButtonControlValueAccessorDirective]
})
export class NimbleRadioButtonModule { }
