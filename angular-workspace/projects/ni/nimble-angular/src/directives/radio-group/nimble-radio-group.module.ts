import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleRadioGroupDirective } from './nimble-radio-group.directive';
import { NimbleRadioGroupControlValueAccessorDirective } from './nimble-radio-group-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/radio-group';

@NgModule({
    declarations: [NimbleRadioGroupDirective, NimbleRadioGroupControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleRadioGroupDirective, NimbleRadioGroupControlValueAccessorDirective]
})
export class NimbleRadioGroupModule {}
