import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleBaseControlValueAccessor } from './nimble-control-value-accessor.directive';
import { NimbleDefaultControlValueAccessor } from './nimble-default-control-value-accessor.directive';

@NgModule({
    declarations: [NimbleBaseControlValueAccessor, NimbleDefaultControlValueAccessor],
    imports: [CommonModule],
    exports: [NimbleDefaultControlValueAccessor]
})
export class NimbleControlValueAccessorModule { }
