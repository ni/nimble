import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleNumberFieldDirective } from './nimble-number-field.directive';
import { NimbleControlValueAccessorModule } from '../control-value-accessor';

import '@ni/nimble-components/dist/esm/number-field';

@NgModule({
    declarations: [NimbleNumberFieldDirective],
    imports: [CommonModule, NimbleControlValueAccessorModule],
    providers: [],
    exports: [NimbleNumberFieldDirective, NimbleControlValueAccessorModule]
})
export class NimbleNumberFieldModule {}
