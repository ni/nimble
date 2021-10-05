import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDefaultControlValueAccessorDirective } from './nimble-default-control-value-accessor.directive';

@NgModule({
    declarations: [NimbleDefaultControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleDefaultControlValueAccessorDirective]
})
export class NimbleControlValueAccessorModule { }
