import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleRadioControlValueAccessorDirective } from './nimble-radio-control-value-accessor.directive';
import { NimbleRadioDirective } from './nimble-radio.directive';
import { RadioControlRegistryModule } from '../../thirdparty/directives/radio_control_value_accessor';

import '@ni/nimble-components/dist/esm/radio';

@NgModule({
    declarations: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective],
    imports: [CommonModule, RadioControlRegistryModule],
    exports: [NimbleRadioControlValueAccessorDirective, NimbleRadioDirective]
})
export class NimbleRadioModule { }
