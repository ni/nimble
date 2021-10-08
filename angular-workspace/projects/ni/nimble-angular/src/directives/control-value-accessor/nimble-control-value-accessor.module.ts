import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDefaultControlValueAccessorDirective } from './nimble-default-control-value-accessor.directive';
import { NimbleNumberControlValueAccessorDirective } from './nimble-number-control-value-accessor.directive';

@NgModule({
    declarations: [NimbleDefaultControlValueAccessorDirective, NimbleNumberControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleDefaultControlValueAccessorDirective, NimbleNumberControlValueAccessorDirective]
})
export class NimbleControlValueAccessorModule { }
