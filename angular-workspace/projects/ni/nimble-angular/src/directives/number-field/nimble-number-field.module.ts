import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleNumberFieldDirective } from './nimble-number-field.directive';
import { NimbleNumberFieldControlValueAccessorDirective } from './nimble-number-field-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/number-field';

@NgModule({
    declarations: [NimbleNumberFieldDirective, NimbleNumberFieldControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleNumberFieldDirective, NimbleNumberFieldControlValueAccessorDirective]
})
export class NimbleNumberFieldModule {}
