import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleTextFieldDirective } from './nimble-text-field.directive';
import { NimbleControlValueAccessorModule } from '../control-value-accessor';

import '@ni/nimble-components/dist/esm/text-field';

@NgModule({
    declarations: [NimbleTextFieldDirective],
    imports: [CommonModule, NimbleControlValueAccessorModule],
    providers: [],
    exports: [NimbleTextFieldDirective, NimbleControlValueAccessorModule]
})
export class NimbleTextFieldModule {}
