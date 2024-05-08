import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleTextFieldDirective } from './nimble-text-field.directive';
import { NimbleTextFieldControlValueAccessorDirective } from './nimble-text-field-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/text-field';

@NgModule({
    declarations: [NimbleTextFieldDirective, NimbleTextFieldControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleTextFieldDirective, NimbleTextFieldControlValueAccessorDirective]
})
export class NimbleTextFieldModule {}
